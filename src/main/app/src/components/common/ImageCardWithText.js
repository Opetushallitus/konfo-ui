import React from 'react';

import { makeStyles, Typography, Box } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { colors } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  text: {
    ...theme.typography.subtitle1,
    color: colors.white,
  },
  img: {
    height: '300px',
    width: '300px',
    objectFit: 'cover',
    [theme.breakpoints.down('lg')]: {
      height: '150px',
      width: '100%',
    },
  },
  box: {
    position: 'absolute',
    right: '0%',
    top: '65%',
    transform: 'translate(0, -50%)',
    background: colors.brandGreen,
    padding: '14px',
  },
  icon: {
    fontSize: '24px',
  },
}));

const ImageCardWithText = (props) => {
  const classes = useStyles();
  const { image, cardText } = props;
  return (
    <div className={classes.root}>
      <img src={image} alt={cardText} className={classes.img} />
      <Box display="flex" alignItems="center" component="span" className={classes.box}>
        <Typography variant="body1" className={classes.text}>
          {cardText}
        </Typography>
        <ChevronRightIcon className={`${classes.text} ${classes.icon}`} />
      </Box>
    </div>
  );
};

export default ImageCardWithText;
