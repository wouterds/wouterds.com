import type { StructuredText } from 'datocms-structured-text-utils';
import { describe, expect, it } from 'vitest';

import { excerptFromContent, imagesFromContent, plainTextFromContent } from './datocms.server';

describe('datocms', () => {
  describe('plainTextFromContent', () => {
    it('should return plain text from content', () => {
      // given
      const content = {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'Hello, world!',
                },
              ],
            },
          ],
        },
      } as unknown as StructuredText;

      // when
      const result = plainTextFromContent(content);

      // then
      expect(result).toEqual('Hello, world!');
    });
  });

  describe('excerptFromContent', () => {
    it('should return excerpt from content', () => {
      // given
      const content = {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'Hello, world!',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'span',
                  value: 'This is test content.',
                },
              ],
            },
          ],
        },
      } as unknown as StructuredText;

      // when
      const result = excerptFromContent(content);

      // then
      expect(result).toEqual('Hello, world!\nThis is test…');
    });
  });

  describe('imagesFromContent', () => {
    it('should return images from content', () => {
      // given
      const content = {
        blocks: [
          {
            __typename: 'GalleryRecord',
            images: [
              {
                url: 'https://example.com/image1.jpg',
              },
              {
                url: 'https://example.com/image2.jpg',
              },
            ],
          },
          {
            __typename: 'GalleryRecord',
            images: [
              {
                url: 'https://example.com/image3.jpg',
              },
            ],
          },
        ],
      } as unknown as StructuredText;

      // when
      const result = imagesFromContent(content);

      // then
      expect(result).toEqual([
        {
          url: 'https://example.com/image1.jpg',
        },
        {
          url: 'https://example.com/image2.jpg',
        },
        {
          url: 'https://example.com/image3.jpg',
        },
      ]);
    });

    it('should return empty array when no blocks are defined', () => {
      // given
      const content = {} as StructuredText;

      // when
      const result = imagesFromContent(content);

      // then
      expect(result).toEqual([]);
    });
  });
});
