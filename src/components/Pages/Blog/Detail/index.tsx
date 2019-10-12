import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { format } from 'date-fns';
import gql from 'graphql-tag';
import mediumZoom from 'medium-zoom';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import fetch from 'isomorphic-unfetch';
import Sentry from 'services/sentry';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Meta from 'components/Meta';
import Markdown from 'components/Markdown';
import Error from 'components/Pages/Error';
import LocalHeader from './Header';
import { Container, Body, Webmentions } from './styles';

const FETCH_DATA = gql`
  query fetchData($slug: String!) {
    post(slug: $slug) {
      id
      title
      excerpt
      slug
      body
      publishedAt
      mediaAsset {
        fileName
      }
      user {
        firstName
        lastName
      }
    }
  }
`;

const INCREASE_VIEW_COUNT = gql`
  mutation increaseViewCount($id: String!) {
    increaseViewCount(id: $id)
  }
`;

interface Props {
  post: any;
}

export const config = { amp: 'hybrid' };

interface Webmention {
  type: string;
  author: {
    name: string;
    photo: string;
    url: string;
  };
  published: Date;
  url: string;
  ['wm-property']: 'repost-of' | 'like-of' | 'in-reply-to';
}

const Detail = (props: Props) => {
  const { post } = props;
  const [webmentions, setWebMentions] = useState<Webmention[]>([]);

  useEffect(() => {
    if (post) {
      mediumZoom('.media--image img', { margin: 25 });

      document
        .querySelectorAll('pre code')
        .forEach(block => hljs.highlightBlock(block));

      fetch(
        `https://webmention.io/api/mentions.jf2?target=${encodeURI(
          `${process.env.URL}/blog/${post.slug}`,
        )}`,
      ).then(async response => {
        const { children } = (await response.json()) || {};

        if (!Array.isArray(children)) {
          return;
        }

        setWebMentions(
          children
            .filter((entry: Webmention) => entry.type === 'entry')
            .map((entry: Webmention) => ({
              ...entry,
              published: new Date(entry.published),
            }))
            .sort((a: Webmention, b: Webmention) =>
              a.published > b.published ? -1 : 1,
            ),
        );
      });
    }
  }, [post]);

  if (!post) {
    return <Error statusCode={404} />;
  }

  const parts = post.mediaAsset.fileName.split('.');
  const image = parts
    ? `${process.env.URL}/static/media/${parts[0]}.embed.${parts[1]}`
    : undefined;

  return (
    <Layout>
      <Meta
        title={post.title}
        description={post.excerpt}
        extra={
          <>
            {post.publishedAt && (
              <meta
                property="article:published_time"
                content={new Date(parseInt(post.publishedAt)).toISOString()}
              />
            )}
            <meta property="og:type" content="article" />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={image} />
            <link
              rel="canonical"
              href={`${process.env.URL}/blog/${post.slug}`}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'NewsArticle',
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `${process.env.URL}/blog/${post.slug}`,
                  },
                  headline: post.title,
                  description: post.excerpt,
                  image: [image],
                  datePublished: post.publishedAt
                    ? new Date(parseInt(post.publishedAt)).toISOString()
                    : undefined,
                  dateModified: post.publishedAt
                    ? new Date(parseInt(post.publishedAt)).toISOString()
                    : undefined,
                  author: {
                    '@type': 'Person',
                    name: `${post.user.firstName} ${post.user.lastName}`,
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'Wouter De Schuyter',
                    url: process.env.URL,
                    logo: {
                      '@type': 'ImageObject',
                      url: `${process.env.URL}/static/wouterds.jpg`,
                    },
                  },
                }),
              }}
            />
          </>
        }
      />
      <Header transparent={true} />
      <LocalHeader mediaAsset={post.mediaAsset} />
      <Layout.Content centered editorial>
        <Container>
          <Body>
            <header>
              <time
                dateTime={(post.publishedAt
                  ? new Date(parseInt(post.publishedAt))
                  : new Date()
                ).toISOString()}
              >
                {format(
                  post.publishedAt
                    ? new Date(parseInt(post.publishedAt))
                    : new Date(),
                  'MMM d, yyyy',
                )}
              </time>
            </header>
            <h1>{post.title}</h1>
            <Markdown markdown={post.body} />
            {webmentions.length > 0 && (
              <Webmentions>
                <h2>Webmentions</h2>
                <ul>
                  {webmentions.map((webmention: Webmention, index: number) => (
                    <li key={index}>
                      <a
                        className="author"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={webmention.url}
                      >
                        <img
                          src={webmention.author.photo}
                          alt={webmention.author.name}
                        />
                        <strong>{webmention.author.name}</strong>
                      </a>
                      <a
                        className="content"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={webmention.url}
                      >
                        {webmention['wm-property'] === 'like-of' && 'liked'}
                        {webmention['wm-property'] === 'in-reply-to' &&
                          'replied'}
                        {webmention['wm-property'] === 'repost-of' &&
                          'retweeted'}
                        {webmention.published.getTime() > 0 &&
                          ` on ${format(webmention.published, 'MMM d, yyyy')}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </Webmentions>
            )}
          </Body>
        </Container>
      </Layout.Content>
      <Footer centered />
    </Layout>
  );
};

Detail.getInitialProps = async ({
  query,
  apolloClient,
  res,
}: NextPageContext) => {
  const { slug } = query;

  const parts = (slug as string).split('-');
  const lastPart = parts.pop();
  if (!isNaN(lastPart as any) && res) {
    return res.writeHead(301, { Location: `/blog/${parts.join('-')}` }).end();
  }

  const { post } = (await apolloClient.query({
    query: FETCH_DATA,
    variables: { slug },
  })).data;

  if (!post && res) {
    res.statusCode = 404;
  }

  // Fire & forget
  try {
    apolloClient.mutate({
      mutation: INCREASE_VIEW_COUNT,
      variables: { id: post.id },
    });
  } catch (e) {
    Sentry.captureException(e);
  }

  return { post };
};

export default Detail;
