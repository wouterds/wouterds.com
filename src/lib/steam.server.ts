import { getUnixTime } from 'date-fns';

import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

const CACHE_TTL_MINUTES = 5;

export class Steam {
  private _steamId: string | null;

  public constructor(steamId?: string) {
    this._steamId = steamId || null;
  }

  private get apiKey() {
    return process.env.STEAM_API_KEY!;
  }

  public async getCurrentlyPlaying() {
    if (!this._steamId) {
      return null;
    }

    const cacheKey = `steam.currently-playing:${md5(this._steamId)}`;
    const cached = await Cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.apiKey}&steamids=${this._steamId}`,
    );

    if (response.status !== 200) {
      return null;
    }

    const data = await response.json();
    const player = data.response.players[0];

    if (!player || player.gameextrainfo === undefined) {
      return null;
    }

    const game = {
      id: player.gameid,
      name: player.gameextrainfo,
      url: `https://store.steampowered.com/app/${player.gameid}`,
      startedAt: getUnixTime(new Date()),
    };

    await Cache.set(cacheKey, game, CACHE_TTL_MINUTES * 60);

    return game;
  }
}
