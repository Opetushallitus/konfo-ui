import React from 'react';

import { makeStyles, Typography, Grid, Card, CardMedia } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useContentful } from '#/src/hooks';

import { colors } from '../../colors';
import { Accordion, Summary } from './Accordion';
import { LinkOrYoutube } from './LinkOrYoutube';

const useStyles = makeStyles({
  notFound: {
    textAlign: 'center',
  },
  header1: {
    fontSize: '40px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '30px',
    fontWeight: '700',
    color: colors.black,
  },
  icon: {
    fontSize: '16px',
  },
  image: {
    display: 'block',
    marginBottom: '15px',
  },

  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  card: {},
  imageContainer: {},
});

const Sisalto = ({ content, alwaysFullWidth, excludeMedia }) => {
  const classes = useStyles();
  const { data, forwardTo, assetUrl } = useContentful();
  const { sivu, asset } = data;
  const ImageComponent = ({ src, alt }) => {
    const url = src.replace('//images.ctfassets.net/', '');
    const a = asset[url];
    return (
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className={classes.imageContainer}>
        <Grid item xs={12} sm={alwaysFullWidth ? 12 : 12} md={alwaysFullWidth ? 12 : 12}>
          <Card className={classes.card} elevation={0}>
            <CardMedia
              className={classes.media}
              image={assetUrl(url)}
              role="img"
              title={a ? a.name : alt}
              aria-label={a ? a.description : alt}
            />
          </Card>
        </Grid>
      </Grid>
    );
  };
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
