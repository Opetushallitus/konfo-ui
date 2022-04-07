import React from 'react';

import { Card, CardMedia, makeStyles } from '@material-ui/core';

import { useContentful } from '#/src/hooks';

const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
});

const ImageComponentImpl = ({ url, title, label }) => {
  const classes = useStyles();
  return (
    <Card elevation={0}>
      <CardMedia
        className={classes.media}
        image={url}
        role="img"
        title={title}
        aria-label={label}
      />
    </Card>
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
      title={a ? a.name : alt}
      label={a ? a.description : alt}
    />
  );
};
