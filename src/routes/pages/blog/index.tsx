import { type LoaderFunctionArgs, type MetaFunction, useLoaderData } from 'react-router';

import { Posts } from '~/components/posts';
import { PostRepository } from '~/graphql/posts/repository.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await new PostRepository(request).getPosts(100);

  return { posts };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Blog' },
    {
      name: 'description',
      content:
        'My personal blog where I write about software development, side projects, travel, and other random stuff that I find interesting.',
    },
  ];
};

export default function Blog() {
  const data = useLoaderData<typeof loader>();

  return <Posts posts={data.posts} />;
}
