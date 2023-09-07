import React from 'react';

import { Card, CardMedia } from '@mui/material';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import { styled } from '#/src/theme';

const PREFIX = 'TeemakuvaImage';

const classes = {
  card: `${PREFIX}-card`,
  media: `${PREFIX}-media`,
};

const StyledCard = styled(Card)(() => ({
  maxWidth: 1200,

  [`& .${classes.media}`]: {
    width: '100%',
    height: 'auto',
  },
}));

export const TeemakuvaImage = ({ imgUrl, altText }) => {
  return (
    <StyledCard className={classes.card} elevation={1}>
      <CardMedia
        component="img"
        className={classes.media}
        image={imgUrl || DefaultHeroImage}
        role="img"
        title={altText}
        alt={altText}
      />
    </StyledCard>
  );
};
