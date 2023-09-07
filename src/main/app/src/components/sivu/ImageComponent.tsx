import React from 'react';

import { Card, CardMedia } from '@mui/material';

import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';

const PREFIX = 'ImageComponent';

const classes = {
  media: `${PREFIX}-media`,
};

const StyledImageComponent = styled(Card)({
  [`& .${classes.media}`]: {
    backgroundSize: 'contain',
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
});

export const ImageComponent = ({ src, alt }: { src: string; alt?: string }) => {
  const { data, assetUrl } = useContentful();
  const { asset } = data;
  const url = src.replace('//images.ctfassets.net/', '');
  const a = asset[url];
  return (
    <StyledImageComponent elevation={0}>
      <CardMedia
        className={classes.media}
        image={assetUrl(url)}
        role="img"
        title={a ? a.name : alt}
        aria-label={a ? a.description : alt}
      />
    </StyledImageComponent>
  );
};
