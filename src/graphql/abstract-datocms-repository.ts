import { type ASTNode, print } from 'graphql';

import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

const CACHE_TTL_HOURS = 2;

export abstract class DatoCMSRepository {
  constructor(private readonly request?: Request) {}

  private get apiKey() {
    return process.env.DATOCMS_API_KEY;
  }

  private get inPreviewMode() {
    if (!this.request) return false;

    const previewCookie = this.request.headers
      .get('cookie')
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('preview-mode='));

    return previewCookie?.includes('true') ?? false;
  }

  private get headers() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.apiKey}`);

    if (this.inPreviewMode) {
      headers.append('X-Include-Drafts', 'true');
    }

    return headers;
  }

  protected fetch = async <TData, TVariables = Record<string, string>>(
    query: ASTNode,
    options: {
      variables?: TVariables;
    },
  ) => {
    const request = JSON.stringify({ query: print(query), variables: options.variables });
    const cacheKey = `datocms.query:${md5(request)}:preview:${this.inPreviewMode}`;

    const cached = await Cache.get(cacheKey);
    if (cached) {
      return cached as TData;
    }

    const response = await fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: this.headers,
      body: request,
    });

    const data = await response.json().then(({ data }) => data as TData);
    await Cache.set(cacheKey, data, CACHE_TTL_HOURS * 60 * 60);

    return data;
  };
}
