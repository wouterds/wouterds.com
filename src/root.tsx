import * as Sentry from '@sentry/react';
import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { Code } from './components/code';
import { Experiments } from './components/experiments';
import Footer from './components/footer';
import Header from './components/header';
import { config } from './config';
import { PreviewModeProvider } from './context/preview-mode';
import stylesheet from './main.css?url';

export const links: Route.LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const previewParam = url.searchParams.get('preview');

  // Get preview mode from cookie
  const previewCookie = request.headers
    .get('cookie')
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('preview-mode='));

  // Determine preview mode state
  let isPreviewMode = previewCookie?.includes('true') ?? false;
  if (previewParam !== null) {
    isPreviewMode = previewParam === 'true';
  }

  return {
    canonical: new URL(url.pathname, config.baseUrl).toString().replace(/\/$/, ''),
    isPreviewMode,
  };
};

export const meta: MetaFunction<typeof loader> = ({ error, data }) => {
  if (error) {
    return [{ title: 'Oops, something went wrong!' }, { name: 'robots', content: 'noindex' }];
  }

  const title = 'Wouter De Schuyter';
  const description =
    "Hi, I'm Wouter and I like to call myself a Digital Creative & Developer. I build digital products and experiences that are beautiful and easy to use.";

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: new URL('/images/og.jpg', config.baseUrl).toString() },
    { name: 'og:url', content: data?.canonical.toString() },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: new URL('/images/og.jpg', config.baseUrl).toString() },
  ];
};

/**
                      _               _
                     | |             | |
 __      _____  _   _| |_ ___ _ __ __| |___   ___ ___  _ __ ___
 \ \ /\ / / _ \| | | | __/ _ \ '__/ _` / __| / __/ _ \| '_ ` _ \
  \ V  V / (_) | |_| | ||  __/ | | (_| \__ \| (_| (_) | | | | | |
   \_/\_/ \___/ \__,_|\__\___|_|  \__,_|___(_)___\___/|_| |_| |_|

 */

export function Layout({ children }: { children: ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS feed for wouterds.com"
          href={new URL('/feed.xml', config.baseUrl).toString()}
        />
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
        {data?.canonical && <link rel="canonical" href={data?.canonical.toString()} />}
        {import.meta.env.PROD && (
          <>
            <script
              defer
              async
              src="https://cloud.umami.is/script.js"
              data-website-id="d504a83c-bc7e-49a6-b643-74c90cd77d01"
            />
            <script
              defer
              async
              src="https://analytics.ahrefs.com/analytics.js"
              data-key="Owr/uCSPdf5IKCNDeu9yDg"
            />
            <script
              defer
              async
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "07f72723f78e4631ae9d5b78947516d4"}'
            />
            <script>
              {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_qZQmNJ5UvyLd2Fb4MbD2L2gg4eUATsF0d2shZ2m4pqW', { api_host:'https://eu.i.posthog.com', person_profiles: 'always' })`}
            </script>
          </>
        )}
      </head>
      <body>
        <PreviewModeProvider isPreviewMode={data?.isPreviewMode}>
          <Header />
          <main className="max-w-screen-md w-full mx-auto px-6 sm:px-8">{children}</main>
          <Footer />
          <Experiments />
          <div id="modal-portal" />
        </PreviewModeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (error instanceof Error && import.meta.env.PROD) {
    Sentry.captureException(error);
  }

  return (
    <>
      <h1 className="text-xl font-medium mb-4">
        {(isRouteErrorResponse(error) && `${error.status} ${error.statusText}`) ||
          'Oops, something went wrong!'}
      </h1>
      <p>
        {isRouteErrorResponse(error) && error.status === 404
          ? 'The page you were looking for could not be found.'
          : (error instanceof Error && error.message) || 'Unknown error occured'}
      </p>
      {error instanceof Error && error.stack && (
        <Code className="mt-1" lang="log">
          {error.stack}
        </Code>
      )}
    </>
  );
}
