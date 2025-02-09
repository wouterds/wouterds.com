import type {
  BlueskyAPIPost,
  BlueskyAPIRecord,
  BlueskyAPIReply,
  BlueskyPost,
  BlueskyReply,
} from './types';

export const transformReply = (
  reply: BlueskyAPIReply,
  { depth = 0, canonical }: { depth?: number; canonical: string },
): BlueskyReply => {
  const [, , did, , rkey] = reply.post.uri.split('/');

  return {
    url: `https://bsky.app/profile/${did}/post/${rkey}`,
    uri: reply.post.uri,
    author: {
      avatarUrl: reply.post.author.avatar,
      displayName: reply.post.author.displayName,
      handle: reply.post.author.handle,
    },
    date: reply.post.record.createdAt,
    text: stripCanonicalUrlFromText(reply.post.record, canonical),
    replies:
      depth < 2 ? reply.replies.map((r) => transformReply(r, { depth: depth + 1, canonical })) : [],
    counts: {
      replies: reply.post.replyCount,
      reposts: reply.post.repostCount,
      likes: reply.post.likeCount,
      quotes: reply.post.quoteCount,
    },
  };
};

export const transformPost = (
  post: BlueskyAPIPost['post'],
  replies: BlueskyAPIReply[] = [],
  { canonical }: { canonical: string },
): BlueskyPost => {
  const [, , did, , rkey] = post.uri.split('/');

  return {
    uri: post.uri,
    url: `https://bsky.app/profile/${did}/post/${rkey}`,
    author: {
      avatarUrl: post.author.avatar,
      displayName: post.author.displayName,
      handle: post.author.handle,
    },
    date: post.record.createdAt,
    text: stripCanonicalUrlFromText(post.record, canonical),
    replies: replies.map((r) => transformReply(r, { depth: 0, canonical })),
    counts: {
      replies: post.replyCount,
      reposts: post.repostCount,
      likes: post.likeCount,
      quotes: post.quoteCount,
    },
  };
};

const stripCanonicalUrlFromText = (record: BlueskyAPIRecord, canonical: string) => {
  if (!record.facets?.length) return record.text;

  const canonicalFacet = record.facets.find((facet) =>
    facet.features.some(
      (feature) => feature.$type === 'app.bsky.richtext.facet#link' && feature.uri === canonical,
    ),
  );

  if (!canonicalFacet) return record.text;

  const before = record.text.slice(0, canonicalFacet.index.byteStart);
  const after = record.text.slice(canonicalFacet.index.byteEnd);

  return (before + after).trim();
};
