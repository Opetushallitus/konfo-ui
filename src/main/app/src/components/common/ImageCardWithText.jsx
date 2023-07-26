import React from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';

const PREFIX = 'ImageCardWithText';

const classes = {
  root: `${PREFIX}-root`,
  text: `${PREFIX}-text`,
  img: `${PREFIX}-img`,
  box: `${PREFIX}-box`,
  icon: `${PREFIX}-icon`,
};

const Root = styled('div')(({ theme }) => ({
  position: 'relative',

  [`& .${classes.text}`]: {
    ...theme.typography.subtitle1,
    color: colors.white,
  },

  [`& .${classes.img}`]: {
    height: '300px',
    width: '300px',
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
      height: '150px',
      width: '100%',
    },
  },

  [`& .${classes.box}`]: {
    position: 'absolute',
    right: '0%',
    top: '65%',
    transform: 'translate(0, -50%)',
    background: colors.brandGreen,
    padding: '14px',
  },

  [`& .${classes.icon}`]: {
    fontSize: '24px',
  },
}));

export const ImageCardWithText = (props) => {
  const { image, cardText } = props;
  return (
    <Root className={classes.root}>
      <img src={image} alt={cardText} className={classes.img} />
      <Box display="flex" alignItems="center" component="span" className={classes.box}>
        <Typography variant="body1" className={classes.text}>
          {cardText}
        </Typography>
        <ChevronRightIcon className={`${classes.text} ${classes.icon}`} />
      </Box>
    </Root>
  );
};
