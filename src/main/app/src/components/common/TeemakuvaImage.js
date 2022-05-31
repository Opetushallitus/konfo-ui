import React from 'react';

import { makeStyles, Card, CardMedia } from '@material-ui/core';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 1200,
  },
  media: {
    width: '100%',
    height: 'auto',
  },
}));

const TeemakuvaImage = ({ imgUrl, altText }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card} elevation={1}>
      <CardMedia
        component="img"
        className={classes.media}
        image={imgUrl || DefaultHeroImage}
        role="img"
        title={altText}
        alt={altText}
      />
    </Card>
  );
};

export default TeemakuvaImage;
