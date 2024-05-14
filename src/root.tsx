import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';

import stylesheet from '~/tailwind.css?url';

import Footer from './components/footer';
import Header from './components/header';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    if (url.pathname === '//') {
      throw new Response(null, { status: 301, headers: { Location: `/` } });
    }

    throw new Response(null, {
      status: 301,
      headers: { Location: `${url.pathname.slice(0, -1)}${url.search}` },
    });
  }

  return {
    url,
    ray: `${request.headers.get('cf-ray')}-${context.cloudflare.cf.colo}`,
    canonical: new URL(url.pathname, baseUrl).href,
  };
};

export const meta: MetaFunction<typeof loader> = ({ error, data }) => {
  if (error) {
    return [{ title: 'Oops, something went wrong!' }];
  }

  const title = 'Wouter De Schuyter';
  const description =
    "Hi, I'm Wouter and I like to call myself a Digital Creative & Developer. I build digital products and experiences that are simple, beautiful and easy to use.";

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: `${data?.url}/images/og.jpg` },
    { name: 'og:url', content: `${data?.url}` },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${data?.url}/images/og.jpg` },
  ];
};

const App = () => {
  const data = useLoaderData<typeof loader>();
  const includeTrackers = data?.url?.toString()?.includes?.('wouterds.be');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS feed for wouterds.be"
          href={new URL('/feed.xml', data?.url).toString()}
        />
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
        {data?.canonical && <link rel="canonical" href={data?.canonical} />}
        {includeTrackers && (
          <script
            defer
            src="https://analytics.eu.umami.is/script.js"
            data-website-id="d504a83c-bc7e-49a6-b643-74c90cd77d01"
          />
        )}
      </head>
      <body>
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <Header />
          <main className="my-8 sm:my-12">
            <Outlet />
          </main>
          <Footer ray={data?.ray} />
        </div>
        <div id="modal-portal" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default withSentry(App, { wrapWithErrorBoundary: false });

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <Header />
          <main className="my-8 sm:my-12">
            <h1 className="text-xl font-medium mb-4">
              {(isRouteErrorResponse(error) && `${error.status} ${error.statusText}`) ||
                'Oops, something went wrong!'}
            </h1>
            <p>
              {isRouteErrorResponse(error) && error.status === 404
                ? 'The page you were looking for could not be found.'
                : error instanceof Error
                  ? error.message
                  : 'Unknown error occured'}
            </p>
            {error instanceof Error && <code>{error.stack}</code>}
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
};
