import { differenceInMinutes } from 'date-fns';
import type { LoaderFunctionArgs } from 'react-router';

import { AranetReadings, NUCReadings, P1Readings, TeslaData } from '~/database';
import { Spotify } from '~/lib/spotify.server';
import { Steam } from '~/lib/steam.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  switch (url.searchParams.get('timeseries')) {
    case 'aranet': {
      const daily = await AranetReadings.getDailyAverages(30);
      const hourly = await AranetReadings.getHourlyAverages(24);

      return Response.json({ daily, hourly });
    }
    case 'tesla': {
      const daily = await TeslaData.getDailyAverages(30);
      const hourly = await TeslaData.getHourlyAverages(24);

      return Response.json({ daily, hourly });
    }
    case 'p1': {
      const daily = await P1Readings.getDailyAverages(30);
      const hourly = await P1Readings.getHourlyAverages(24);

      return Response.json({ daily, hourly });
    }
    case 'nuc': {
      const daily = await NUCReadings.getDailyAverages(30);
      const hourly = await NUCReadings.getHourlyAverages(24);

      return Response.json({ daily, hourly });
    }
  }

  const [aranet, tesla, p1, nuc, spotify, steam] = await Promise.all([
    AranetReadings.getLast(),
    TeslaData.getLast(),
    P1Readings.getLast(),
    NUCReadings.getLast(),
    getLastSpotifyTrack(),
    getLastSteamGame(),
  ]);

  return Response.json({ aranet, tesla, p1, nuc, spotify, steam });
};

const getLastSpotifyTrack = async () => {
  const spotify = new Spotify();

  let track = await spotify.getCurrentlyPlaying();
  if (!track) {
    const recentlyPlayed = await spotify.getRecentlyPlayed(1)?.then((tracks) => tracks?.[0]);
    if (recentlyPlayed && differenceInMinutes(new Date(), recentlyPlayed.playedAt) <= 15) {
      track = recentlyPlayed;
    }
  }

  return track;
};

const getLastSteamGame = async () => {
  const steam = new Steam('wouterds');
  return await steam.getCurrentlyPlaying();
};
