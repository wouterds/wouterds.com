import {
  SiBluesky,
  SiGithub,
  SiInstagram,
  SiSteam,
  SiThreads,
  SiYoutube,
} from '@icons-pack/react-simple-icons';

import { Article } from '~/components/article';

const links = [
  {
    icon: SiGithub,
    text: 'GitHub',
    link: 'https://github.com/wouterds',
  },
  {
    icon: ({ className }: { className: string }) => (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: 'currentColor' }}
        className={className}>
        <title>LinkedIn</title>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    text: 'LinkedIn',
    link: 'https://linkedin.com/in/wouterds',
  },
  {
    icon: SiBluesky,
    text: 'Bluesky',
    link: 'https://bsky.app/profile/wouterds.com',
  },
  {
    icon: ({ className }: { className: string }) => (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: 'currentColor' }}
        className={className}>
        <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
      </svg>
    ),
    text: 'Twitter',
    link: 'https://twitter.com/wouterds',
  },
  {
    icon: SiThreads,
    text: 'Threads',
    link: 'https://threads.net/@wouterds',
  },
  {
    icon: SiInstagram,
    text: 'Instagram',
    link: 'https://instagram.com/wouterds',
  },
  {
    icon: SiSteam,
    text: 'Steam',
    link: 'https://steamcommunity.com/id/wouterds/',
  },
];

export default function Home() {
  return (
    <Article>
      <h1 className="mb-12">Wouter De Schuyter</h1>
      <p>Hey, I&apos;m Wouter, and I like to call myself a Digital Creative & Developer.</p>
      <p>
        I&apos;ve been doing web &amp; mobile development for over 15 years, lately mostly using
        React, React Native, and Node.js. I studied{' '}
        <a href="https://devine.be/en" target="_blank" rel="noreferrer">
          Digital Design & Development
        </a>{' '}
        at Howest University College and have worked with various startups, scale-ups, and agencies.
        I love working on user facing products that are used by millions (currently @{' '}
        <a href="https://tally.so" target="_blank" rel="noreferrer">
          Tally
        </a>
        ).
      </p>
      <p>
        In my free time I enjoy travel, photography and experimenting with Raspberry Pi &amp;
        electronics. Or just in general creating stuff. Been following the crypto space since 2017
        but have been taking some distance from it more recently.
      </p>
      <p className="mb-2">You can also find me on</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 p-0 m-0 list-none">
        {links.map((link) => (
          <li key={link.link} className="m-0 p-0">
            <a
              href={link.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5">
              <link.icon className="size-5" />
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </Article>
  );
}
