import React from 'react';

import { Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { ImageComponent } from '#/src/components/sivu/ImageComponent';
import { useContentful } from '#/src/hooks';

import { Accordion, Summary } from './Accordion';
import { LinkOrYoutube } from './LinkOrYoutube';

const Sisalto = ({ content, excludeMedia }) => {
  const { data, forwardTo } = useContentful();
  const { sivu } = data;
  const isBlank = (str) => {
    return !str || /^\s*$/.test(str);
  };
  const SivuLink = ({ slug, children }) => {
    return sivu[slug] ? (
      <LocalizedLink component={RouterLink} to={forwardTo(slug)}>
        {isBlank(children ? children[0] : null) ? sivu[slug].name : children}
      </LocalizedLink>
    ) : null;
  };

  return (
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
        },
      }}>
      {content}
    </Markdown>
  );
};
export default Sisalto;
