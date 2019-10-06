import React from 'react';
import Head from 'next/head';
import { useAmp } from 'next/amp';
import marked from 'marked';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from './styles';

interface Props {
  markdown: string;
}

const FETCH_MEDIA = gql`
  query fetchData($ids: [String]) {
    mediaAssets(ids: $ids) {
      id
      name
      fileName
      url
      width
      height
    }
  }
`;

const extractMediaIds = (text: string): string[] => {
  const matches = text.match(new RegExp(/\:media\:(.+)\:/g));

  if (!matches) {
    return [];
  }

  return matches.map(match => match.replace(':media:', '').replace(':', ''));
};

const generateHtmlFromMarkdown = (
  markdown: string,
  mediaAssets: Array<{
    id: string;
    name: string;
    fileName?: string;
    url?: string;
    width: number;
    height: number;
  }>,
  isAmp: boolean = false,
): string => {
  let html = marked(markdown);

  for (const mediaAsset of mediaAssets) {
    if (mediaAsset.fileName) {
      html = html.replace(
        `:media:${mediaAsset.id}:`,
        isAmp
          ? `<amp-img src="/static/media/${mediaAsset.fileName}" layout="responsive" height="${mediaAsset.height}" width="${mediaAsset.width}" alt="${mediaAsset.fileName}" />`
          : `<div class="media media--image" style="padding-bottom: ${(mediaAsset.height /
              mediaAsset.width) *
              100}%"><img src="/static/media/${mediaAsset.fileName}" alt="${
              mediaAsset.fileName
            }" /></div>`,
      );
    }

    if (mediaAsset.url) {
      const url = new URL(mediaAsset.url);

      if (['youtube.com', 'youtu.be'].includes(url.hostname)) {
        const youtubeId = url.pathname.split('/').pop();

        html = html.replace(
          `:media:${mediaAsset.id}:`,
          isAmp
            ? `<amp-youtube data-videoid="${youtubeId}" layout="responsive" height="${mediaAsset.height}" width="${mediaAsset.width}"></amp-youtube>`
            : `<div class="media media--video" style="padding-bottom: ${(mediaAsset.height /
                mediaAsset.width) *
                100}%"><iframe src="https://youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen>${url}</iframe></div>`,
        );
      }
    }
  }

  return html;
};

const Markdown = ({ markdown }: Props) => {
  const isAmp = useAmp();
  const mediaIds = extractMediaIds(markdown);
  const { data } = useQuery(FETCH_MEDIA, { variables: { ids: mediaIds } });
  const mediaAssets = (data && data.mediaAssets) || [];

  const html = generateHtmlFromMarkdown(markdown, mediaAssets, isAmp);

  return (
    <>
      {html.indexOf('amp-youtube') > -1 && (
        <Head>
          <script
            async
            custom-element="amp-youtube"
            src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
          ></script>
        </Head>
      )}
      <Container dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

export default Markdown;
