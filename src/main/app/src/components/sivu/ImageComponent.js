import React from 'react';

import { Card, CardMedia, Grid, makeStyles } from '@material-ui/core';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

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

const ImageComponentImpl = ({ url, title, label }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      className={classes.imageContainer}>
      <Grid item xs={12} sm={12} md={12}>
        <Card className={classes.card} elevation={0}>
          <CardMedia
            className={classes.media}
            image={url}
            role="img"
            title={title}
            aria-label={label}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export const FullWidthImageComponent = ({ src, alt }) => {
  const { data, assetUrl } = useContentful();
  const { asset } = data;
  const url = src.replace('//images.ctfassets.net/', '');
  const a = asset[url];
  return (
    <ImageComponentImpl
      url={assetUrl(url)}
      alwaysFullWidth={true}
      title={a ? a.name : alt}
      label={a ? a.description : alt}
    />
  );
};

export const ImageComponent = ({ src, alt }) => {
  const { data, assetUrl } = useContentful();
  const { asset } = data;
  const url = src.replace('//images.ctfassets.net/', '');
  const a = asset[url];
  return (
    <ImageComponentImpl
      url={assetUrl(url)}
      alwaysFullWidth={false}
      title={a ? a.name : alt}
      label={a ? a.description : alt}
    />
  );
};
