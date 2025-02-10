import { StatusCodes } from 'http-status-codes';
import { type LoaderFunctionArgs } from 'react-router';

import { config } from '~/config';
import { PostRepository } from '~/graphql/posts/repository.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await new PostRepository(request).getPosts();

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemap += `<url><loc>${config.baseUrl}</loc></url>`;
  sitemap += `<url><loc>${new URL('/blog', config.baseUrl).toString()}</loc></url>`;
  sitemap += `<url><loc>${new URL('/contact', config.baseUrl).toString()}</loc></url>`;
  for (const { slug } of posts) {
    sitemap += `<url><loc>${new URL('/blog', config.baseUrl).toString()}/${slug}</loc></url>`;
  }
  sitemap += '</urlset>';

  return new Response(sitemap, {
    status: StatusCodes.OK,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
