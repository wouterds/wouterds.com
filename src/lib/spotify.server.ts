import { Buffer } from 'node:buffer';

import { addSeconds, getUnixTime, isPast } from 'date-fns';

import { AuthTokens } from '~/database';

export class Spotify {
  private _refreshToken: string | null;
  private _accessToken: string | null;
  private _expiresAt: Date | null = null;

  public constructor(refreshToken?: string, accessToken?: string) {
    this._refreshToken = refreshToken || null;
    this._accessToken = accessToken || null;
  }

  private get clientId() {
    return process.env.SPOTIFY_CLIENT_ID!;
  }

  private get clientSecret() {
    return process.env.SPOTIFY_CLIENT_SECRET!;
  }

  private get refreshToken() {
    return (async () => {
      if (this._refreshToken) {
        return this._refreshToken!;
      }

      const authToken = await AuthTokens.get('SPOTIFY', 'REFRESH_TOKEN');
      this._refreshToken = authToken?.token || null;

      return this._refreshToken!;
    })();
  }

  private get accessToken() {
    return (async () => {
      if (this._accessToken) {
        return this._accessToken;
      }

      const authToken = await AuthTokens.get('SPOTIFY', 'ACCESS_TOKEN');
      this._accessToken = authToken?.token || null;

      if (authToken?.expiresAt && isPast(authToken.expiresAt)) {
        await this.exchangeToken();
      }

      return this._accessToken!;
    })();
  }

  public authorizeUrl(redirectUri: string) {
    const scopes = ['user-read-recently-played', 'user-read-currently-playing'];

    return new URL(
      `/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
      })}`,
      'https://accounts.spotify.com',
    ).toString();
  }

  public async authorize(code: string, redirectUri: string, options?: { noStore?: boolean }) {
    const noStore = options?.noStore || false;

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
          'base64',
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    this._refreshToken = data.refresh_token;
    this._accessToken = data.access_token;
    this._expiresAt = addSeconds(new Date(), data.expires_in);

    if (!noStore) {
      await this.storeTokens();
    }
  }

  public async storeTokens() {
    if (!this._accessToken || !this._refreshToken || !this._expiresAt) {
      return false;
    }

    await Promise.all([
      AuthTokens.upsert('SPOTIFY', 'ACCESS_TOKEN', {
        token: this._accessToken,
        expiresAt: this._expiresAt,
      }),
      AuthTokens.update('SPOTIFY', 'REFRESH_TOKEN', {
        token: this._refreshToken,
      }),
    ]);

    return true;
  }

  public async exchangeToken() {
    const data = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
          'base64',
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: await this.refreshToken,
      }),
    }).then((res) => res.json());

    await AuthTokens.upsert('SPOTIFY', 'ACCESS_TOKEN', {
      token: data.access_token,
      expiresAt: addSeconds(new Date(), data.expires_in),
    });

    this._accessToken = data.access_token;
  }

  public async getMe() {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${await this.accessToken}` },
    });

    const data: { id: string; display_name: string } = await response.json();

    return {
      id: data.id,
      name: data.display_name,
    };
  }

  public async getCurrentlyPlaying() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${await this.accessToken}` },
    });

    if (response.status !== 200) {
      return null;
    }

    return response.json().then(({ item }: { item: SpotifyRawDataTrack }) => mapSong(item));
  }

  public async getRecentlyPlayed(tracks = 3) {
    const params = new URLSearchParams({});
    if (tracks) params.append('limit', tracks.toString());

    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?${params}`, {
      headers: { Authorization: `Bearer ${await this.accessToken}` },
    });

    if (response.status !== 200) {
      return [];
    }

    return response
      .json()
      .then((songs: { items: Array<{ track: SpotifyRawDataTrack; played_at: string }> }) =>
        songs.items.map(({ track, played_at }) => mapSong(track, played_at)),
      );
  }
}

type SpotifyRawDataTrack = {
  id: string;
  name: string;
  explicit: boolean;
  external_urls: { spotify: string };
  artists: {
    id: string;
    name: string;
    external_urls: { spotify: string };
  }[];
  played_at: string;
};

const mapSong = (data: SpotifyRawDataTrack, playedAt?: string) => {
  if (!data?.id) {
    return null;
  }

  return {
    id: data.id,
    url: data.external_urls.spotify,
    explicit: data.explicit,
    name: data.name,
    artist: data.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
    playedAt: getUnixTime(playedAt || new Date()),
  };
};
