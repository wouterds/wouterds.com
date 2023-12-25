import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { StructuredText } from 'react-datocms';

import { fetchPosts } from '~/lib/datocms.server';

export const loader = async ({
  context,
}: LoaderFunctionArgs & { context: { env: Record<string, string> } }) => {
  const posts = await fetchPosts(
    context.env.DATOCMS_API_ENDPOINT,
    context.env.DATOCMS_API_KEY,
  );

  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="text-center">
        <img
          src="/images/wouterds.2024.jpg"
          alt="Headshot of Wouter De Schuyter"
          className="rounded-full w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black dark:text-white text-opacity-50 dark:text-opacity-50">
          Digital Creative & Developer
        </h2>
      </header>
      <section>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>
                <a href={`/posts/${post.slug}`}>{post.title}</a>
              </h3>
              <StructuredText data={post.body} renderBlock={() => null} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
