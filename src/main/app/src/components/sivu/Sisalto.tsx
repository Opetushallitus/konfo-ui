import React, { RefObject } from 'react';

import { Link, Typography } from '@mui/material';
import Markdown from 'markdown-to-jsx';

import { EmbeddedPistelaskuri } from '#/src/components/laskuri/EmbeddedPistelaskuri';
import { ImageComponent } from '#/src/components/sivu/ImageComponent';
import { useContentful } from '#/src/hooks/useContentful';

import { Accordion, Summary } from './Accordion';
import { LinkOrYoutube } from './LinkOrYoutube';

const isBlank = (str?: string) => {
  return !str || /^\s*$/.test(str);
};

// Markdownissa tällainen:
// <sivu slug="sivun-url-tunniste">Kuvaava linkin teksti</sivu>
// Children-attribuuttiin näyttää tulevan aina taulukko, jossa elementin string, eli tässä
// esimerkissä children olisi ["Kuvaava linkin teksti"]
const SivuLink = ({ slug, children }: { slug: string; children: [string] | [] }) => {
  const { data, forwardTo } = useContentful();
  const { sivu } = data;

  return sivu[slug] ? (
    <Link href={forwardTo(slug)} underline="always">
      {isBlank(children?.[0]) ? sivu[slug].name : children}
    </Link>
  ) : null;
};

export const Sisalto = ({
  content,
  excludeMedia = false,
  rootRef,
}: {
  content?: string;
  excludeMedia?: boolean;
  rootRef?: RefObject<HTMLDivElement>;
}) => {
  return content ? (
    <Markdown
      options={{
        overrides: {
          img: {
            component: excludeMedia ? () => null : ImageComponent,
          },
          h1: {
            component: Typography,
            props: {
              variant: 'h1',
              gutterBottom: true,
            },
          },
          h2: {
            component: Typography,
            props: {
              variant: 'h2',
              gutterBottom: true,
            },
          },
          h3: {
            component: Typography,
            props: {
              variant: 'h3',
              gutterBottom: true,
            },
          },
          h4: {
            component: Typography,
            props: {
              variant: 'h4',
              gutterBottom: true,
            },
          },
          p: {
            component: Typography,
            props: {
              variant: 'body1',
              component: 'div',
              paragraph: true,
            },
          },
          a: {
            component: excludeMedia ? () => null : LinkOrYoutube,
          },
          details: {
            component: excludeMedia ? () => null : Accordion,
          },
          summary: {
            component: excludeMedia ? () => null : Summary,
          },
          sivu: {
            component: SivuLink,
          },
          pistelaskuri: {
            component: EmbeddedPistelaskuri,
            props: {
              rootRef: rootRef,
            },
          },
        },
      }}>
      {content}
    </Markdown>
  ) : null;
};
