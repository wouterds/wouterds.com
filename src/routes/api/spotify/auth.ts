import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { type LoaderFunctionArgs, redirect } from 'react-router';

import { Spotify } from '~/lib/spotify.server';

const redirectUri = 'https://wouterds.com/spotify/authorize';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const spotify = new Spotify();

  const code = new URLSearchParams(new URL(request.url).search).get('code');
  if (!code) {
    throw redirect(spotify.authorizeUrl(redirectUri));
  }

  await spotify.authorize(code, redirectUri, { noStore: true });
  const user = await spotify.getMe();
  if (user.id !== 'wouterds') {
    throw new Response(getReasonPhrase(StatusCodes.FORBIDDEN), { status: StatusCodes.FORBIDDEN });
  }

  await spotify.storeTokens();

  return new Response(getReasonPhrase(StatusCodes.OK), { status: StatusCodes.OK });
};
