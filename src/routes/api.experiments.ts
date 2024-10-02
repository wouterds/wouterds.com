import { json, LoaderFunctionArgs } from '@remix-run/node';
import { differenceInMinutes } from 'date-fns';

import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { AranetReadings } from '~/database/aranet-readings/repository';
import { Spotify, SpotifyTrack } from '~/lib/spotify';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tesla = TeslaRepository.create(context);
  const spotify = Spotify.create(context);

  await spotify.refreshAccessToken();

  let track: SpotifyTrack | null = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return json(
    {
      aranet: await AranetReadings.getLast(),
      tesla: await tesla.getLast(),
      spotify: track,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
