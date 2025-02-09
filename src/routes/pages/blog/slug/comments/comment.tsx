import clsx from 'clsx';
import { format } from 'date-fns';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import type { BlueskyAuthor, BlueskyReply } from '~/lib/bluesky';

export type CommentProps = {
  level?: number;
  uri: string;
  className?: string;
  url: string;
  author: BlueskyAuthor;
  date: string;
  text: string;
  replies: BlueskyReply[];
  counts: {
    replies: number;
    reposts: number;
    likes: number;
    quotes: number;
  };
};

export const Comment = ({
  url,
  author,
  date,
  text,
  replies,
  level = 0,
  uri,
  counts,
  className,
}: CommentProps) => {
  if (text?.length < 3) {
    return null;
  }

  return (
    <>
      <div
        className={clsx('group relative flex gap-4 py-4', className, {
          'pt-0': level > 0,
          'pl-8': level === 1,
          'pl-16': level === 2,
        })}>
        <Avatar>
          <AvatarImage src={author.avatarUrl} alt={author.displayName} />
          <AvatarFallback>{author.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 leading-tight">
            <a
              href={`https://bsky.app/profile/${author.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 no-underline hover:underline dark:text-zinc-100 truncate">
              {author.displayName || author.handle}
            </a>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={`https://bsky.app/profile/${author.handle}/post/${uri.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-zinc-500 dark:text-zinc-400 no-underline hover:underline shrink-0">
                    {format(date, 'MMM d, yyyy')}
                  </a>
                </TooltipTrigger>
                <TooltipContent>{format(date, 'MMMM do yyyy, HH:mm')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300 mb-1">{text}</p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 -mx-2">
            <a
              href={url}
              target="_blank"
              className="inline-flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 no-underline font-normal text-inherit rounded-full px-2 py-1 hover:bg-slate-50 dark:hover:bg-zinc-800"
              rel="noreferrer">
              <MessageCircle size={16} />
              <span>{counts.replies}</span>
            </a>
            <a
              href={url}
              target="_blank"
              className="inline-flex items-center gap-1 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 no-underline font-normal text-inherit rounded-full px-2 py-1 hover:bg-slate-50 dark:hover:bg-zinc-800"
              rel="noreferrer">
              <Repeat2 size={16} />
              <span>{counts.reposts}</span>
            </a>
            <a
              href={url}
              target="_blank"
              className="inline-flex items-center gap-1 transition-colors hover:text-rose-600 dark:hover:text-rose-400 no-underline font-normal text-inherit rounded-full px-2 py-1 hover:bg-slate-50 dark:hover:bg-zinc-800"
              rel="noreferrer">
              <Heart size={16} />
              <span>{counts.likes}</span>
            </a>
          </div>
        </div>
      </div>
      {replies.map((reply) => (
        <Comment key={reply.uri} {...reply} level={level + 1} />
      ))}
    </>
  );
};
