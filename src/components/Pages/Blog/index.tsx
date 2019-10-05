import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';
import gql from 'graphql-tag';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Posts, { Post } from 'components/Posts';
import Meta from 'components/Meta';
import { Container, Links } from './styles';

const POSTS_PER_PAGE = 10;

const FETCH_DATA = gql`
  query fetchData($limit: Int, $offset: Int) {
    postCount
    posts(limit: $limit, offset: $offset) {
      id
      title
      slug
      excerpt
      publishedAt
    }
  }
`;

interface Props {
  page: number;
  posts: Post[];
  postCount: number;
}

const Blog = (props: Props) => {
  const { posts, postCount, page } = props;

  const hasPrevPage = page > 0;
  const hasNextPage = page * POSTS_PER_PAGE < postCount;

  return (
    <Layout>
      <Meta title="Blog" />
      <Header />
      <Layout.Content centered editorial={posts.length === 0}>
        <Container>
          {posts.length === 0 && (
            <>
              <h1>The end</h1>
              <p>
                Looks like you reached the end of my blog, no more posts here!
              </p>
            </>
          )}
          {posts.length > 0 && <Posts posts={posts} />}

          {(hasNextPage || hasPrevPage) && (
            <Links>
              {hasPrevPage ? (
                <Link href={`/blog?page=${page}`}>
                  <a>&laquo; previous</a>
                </Link>
              ) : (
                <span />
              )}
              {hasNextPage && (
                <Link href={`/blog?page=${page + 2}`}>
                  <a>next &raquo;</a>
                </Link>
              )}
            </Links>
          )}
        </Container>
      </Layout.Content>
      <Footer centered />
    </Layout>
  );
};

Blog.getInitialProps = async ({
  query,
  apolloClient,
  res,
}: NextPageContext) => {
  let { page = 1 } = query;

  if (page === '1' && res) {
    return res.writeHead(302, { Location: '/blog' }).end();
  }

  page = Number(page);
  if (Number.isNaN(page)) {
    page = 1;

    if (res) {
      res.statusCode = 404;
    }
  }

  page = page - 1;
  if (page < 0) {
    page = 0;

    if (res) {
      res.statusCode = 404;
    }
  }

  const { posts, postCount } = (await apolloClient.query({
    query: FETCH_DATA,
    variables: { limit: POSTS_PER_PAGE, offset: page * POSTS_PER_PAGE },
  })).data;

  if (posts.length === 0 && res) {
    res.statusCode = 404;
  }

  return { page, posts, postCount };
};

export default Blog;
