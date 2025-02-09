import { render, type StructuredTextDocument } from 'datocms-structured-text-to-html-string';
import { isStructuredText } from 'datocms-structured-text-utils';
import { Feed } from 'feed';
import { StatusCodes } from 'http-status-codes';

import { config } from '~/config';
import type { GalleryRecord, VideoRecord } from '~/graphql';
import { PostRepository } from '~/graphql/posts/repository.server';

export const loader = async () => {
  const posts = await new PostRepository().getPosts();

  const feed = new Feed({
    title: "Wouter's blog",
    description:
      'My personal blog where I write about software development, side projects, travel, and other random stuff that I find interesting.',
    id: config.baseUrl,
    link: config.baseUrl,
    copyright: `© ${new Date().getFullYear()} Wouter De Schuyter`,
    image: new URL('/favicon.svg', config.baseUrl).toString(),
    updated: new Date(posts[0].date),
    generator: 'https://github.com/wouterds/wouterds.com',
    author: { name: 'Wouter De Schuyter' },
  });

  for (const { poster, slug, title, excerpt, content, date } of posts) {
    if (!isStructuredText(content)) {
      continue;
    }

    feed.addItem({
      title,
      id: new URL(`/blog/${slug}`, config.baseUrl).toString(),
      link: new URL(`/blog/${slug}`, config.baseUrl).toString(),
      image: poster
        ? new URL(`/images${new URL(poster.url).pathname}`, config.baseUrl).toString()
        : undefined,
      description: excerpt,
      content: render(content as unknown as StructuredTextDocument, {
        renderBlock: ({ record, adapter: { renderNode } }) => {
          if (record.__typename === 'GalleryRecord') {
            const { images } = record as GalleryRecord;
            if (images.length) {
              return renderNode(
                'p',
                {},
                images
                  .map((image, index) => [
                    renderNode('img', {
                      src: new URL(
                        `/images${new URL(image.url).pathname}`,
                        config.baseUrl,
                      ).toString(),
                      width: '100%',
                    }),
                    index !== images.length - 1 && renderNode('br'),
                  ])
                  .filter(Boolean),
              )?.toString() as string;
            }
          }

          if (record.__typename === 'VideoRecord') {
            const { video } = record as VideoRecord;
            if (video.provider === 'youtube') {
              return renderNode(
                'iframe',
                {
                  src: `https://youtube.com/embed/${video.providerUid}`,
                  width: '100%',
                  style: 'aspect-ratio:16/9',
                },
                [],
              )?.toString() as string;
            }

            if (video.provider === 'vimeo') {
              return renderNode(
                'iframe',
                {
                  src: `https://player.vimeo.com/video/${video.providerUid}`,
                  width: '100%',
                  style: 'aspect-ratio:16/9',
                },
                [],
              )?.toString() as string;
            }
          }

          return '';
        },
      }) as string,
      date: new Date(date),
    });
  }

  feed.addCategory('Software Development');
  feed.addCategory('Web Development');
  feed.addCategory('Web3');
  feed.addCategory('Travel');
  feed.addCategory('Photography');
  feed.addCategory('Personal');

  return new Response(feed.rss2(), {
    status: StatusCodes.OK,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
