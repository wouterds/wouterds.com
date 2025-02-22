import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

import { logger } from '../logger';
import { transformPost } from './transformers';
import type { BlueskyAPIPost, BlueskyAPIReply, BlueskyPost } from './types';

const CACHE_TTL_MINUTES = 5;

const getPostThread = async (atUri: string): Promise<BlueskyAPIReply[]> => {
  const cacheKey = `bluesky.post.replies:${md5(atUri)}`;
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached as BlueskyAPIReply[];
  }

  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${new URLSearchParams({
      uri: atUri,
    })}`,
  );

  if (!response.ok) {
    const errorData = await response.text();
    logger.error(
      `Failed to fetch posts replies: ${response.status} ${response.statusText}`,
      response.url,
      errorData,
    );
    return [];
  }

  const data = await response.json();
  if (!Array.isArray(data?.thread?.replies)) {
    return [];
  }

  const result = data.thread.replies as BlueskyAPIReply[];

  await Cache.set(cacheKey, result, CACHE_TTL_MINUTES * 60);

  return result;
};

const getPosts = async (canonical: string): Promise<BlueskyPost[]> => {
  const cacheKey = `bluesky.posts:${md5(canonical)}`;
  const cached = await Cache.get(cacheKey);
  if (cached) {
    return cached as BlueskyPost[];
  }

  const response = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${new URLSearchParams({
      q: '*',
      url: canonical,
      sort: 'top',
    })}`,
  );

  if (!response.ok) {
    const errorData = await response.text();
    logger.error(
      `Failed to fetch posts: ${response.status} ${response.statusText}`,
      response.url,
      errorData,
    );
    return [];
  }

  const posts = await response.json().then(async (data) => {
    if (!data?.posts?.length) {
      return [];
    }

    return Promise.all(
      data.posts.map(async (post: BlueskyAPIPost['post']) => {
        return transformPost(post, await getPostThread(post.uri), { canonical });
      }),
    );
  });

  await Cache.set(cacheKey, posts, CACHE_TTL_MINUTES * 60);

  return posts;
};

export const Bluesky = {
  getPosts,
  getPostThread,
};
