import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import * as Sentry from '@sentry/node';
import { isbot } from 'isbot';
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server';
import {
  type AppLoadContext,
  type EntryContext,
  type HandleErrorFunction,
  ServerRouter,
} from 'react-router';

export const streamTimeout = 5_000;

const ASCII_ART = `                      _               _
                     | |             | |
 __      _____  _   _| |_ ___ _ __ __| |___   ___ ___  _ __ ___
 \\ \\ /\\ / / _ \\| | | | __/ _ \\ '__/ _\` / __| / __/ _ \\| '_ \` _ \\
  \\ V  V / (_) | |_| | ||  __/ | | (_| \\__ \\| (_| (_) | | | | | |
   \\_/\\_/ \\___/ \\__,_|\\__\\___|_|  \\__,_|___(_)___\\___/|_| |_| |_|


 build ${process.env.COMMIT_SHA}

 © ${new Date().getFullYear()} Wouter De Schuyter - https://wouterds.com
`;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady';

    const { pipe: originalPipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          const pipe = (writable: NodeJS.WritableStream) => {
            const chunks: Buffer[] = [];
            const transform = new PassThrough({
              transform(chunk, _, callback) {
                chunks.push(chunk);
                callback();
              },
              flush(callback) {
                let content = Buffer.concat(chunks).toString();
                content = content.replace(
                  '<!DOCTYPE html>',
                  `<!DOCTYPE html>\n<!--\n${ASCII_ART}\n-->\n`,
                );
                this.push(Buffer.from(content));
                callback();
              },
            });
            transform.pipe(writable);
            return originalPipe(transform);
          };

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
}

export const handleError: HandleErrorFunction = (error, { request }) => {
  // React Router may abort some interrupted requests, report those
  if (!request.signal.aborted) {
    if (import.meta.env.PROD) {
      Sentry.captureException(error);
    }

    console.error(error);
  }
};
