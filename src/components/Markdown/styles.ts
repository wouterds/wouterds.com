import styled from 'styled-components';

export const Container = styled.div`
  p code {
    background: #f7f7f9;
    border: 1px solid #e1e1e8;
    color: var(--color-tint);
    padding: 0.15em 0.3em;
    border-radius: 3px;
    font-size: 0.8em;

    @media (prefers-color-scheme: dark) {
      border-color: #354052;
      background: #232c3b;
    }
  }

  pre {
    color: var(--color-text-light);

    code {
      background: #f7f7f9;
      padding: 0.75em 1em;
      font-size: 0.8em;
      display: block;
      overflow-x: scroll;
      margin: 0.5em 0 1em;

      @media (prefers-color-scheme: dark) {
        background: #283140;
      }
    }
  }

  ul {
    list-style: disc inside;
  }

  .media {
    position: relative;
    background: #f7f7f9;

    @media (prefers-color-scheme: dark) {
      background: #222a36;
    }

    &--image {
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border: 0;
      }
    }

    &--video {
      iframe {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
`;
