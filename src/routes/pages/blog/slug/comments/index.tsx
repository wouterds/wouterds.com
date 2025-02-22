import { SiBluesky } from '@icons-pack/react-simple-icons';
import { LucideTriangleAlert } from 'lucide-react';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Skeleton } from '~/components/ui/skeleton';
import { BLUESKY_AUTHOR } from '~/lib/bluesky';

import type { loader } from '../index';
import { Comment } from './comment';

export const CommentSkeleton = () => {
  return (
    <div className="group relative flex gap-3 sm:gap-4 py-4">
      <Avatar>
        <AvatarFallback>
          <Skeleton className="h-full w-full rounded-full" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-3 space-y-2 pb-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </div>
  );
};

export const Comments = () => {
  const { blueskyPosts, title, canonical } = useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <div className="mt-12 sm:mt-16 pt-0 sm:pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="mb-3">
            Join the conversation by{' '}
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              <span className="inline-block mr-1.5">sharing on Bluesky</span>
              <SiBluesky className="text-zinc-400 dark:text-zinc-500 inline-block align-text-bottom size-4" />
            </span>
          </p>

          <div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 first:border-t-0">
              <CommentSkeleton />
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              <CommentSkeleton />
            </div>
          </div>
        </div>
      }>
      <Await resolve={blueskyPosts}>
        {(posts) => {
          const selfPost = posts?.find((post) => post.author.handle === BLUESKY_AUTHOR);

          return (
            <div className="mt-12 sm:mt-16 pt-0 sm:pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold">Comments</h2>
              <p className="mb-3">
                Join the conversation by{' '}
                <span>
                  {selfPost ? (
                    <a
                      href={selfPost.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mr-1.5">
                      replying on Bluesky
                    </a>
                  ) : (
                    <a
                      href={`https://bsky.app/intent/compose?${new URLSearchParams({ text: `${title} ${canonical}` })}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mr-1.5">
                      sharing on Bluesky
                    </a>
                  )}
                  <SiBluesky className="text-blue-600 dark:text-blue-500 inline-block align-text-bottom size-4" />
                </span>
              </p>

              {posts?.map((post) => <Comment key={post.uri} {...post} />)}

              {posts === null && (
                <p className="inline-flex px-3 py-2 rounded-md items-center gap-2 text-sm border border-amber-800/20 bg-amber-50/50 text-amber-800/80 dark:border-amber-500/25 dark:bg-amber-800/25 dark:text-amber-300/90">
                  <LucideTriangleAlert className="size-4" />
                  Could not load comments from Bluesky right now.
                </p>
              )}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};
