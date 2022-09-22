import React from 'react';

import { styled } from '@mui/material/styles';

const PREFIX = 'ReactiveBorder';

const classes = {
  spaceOnBorders: `${PREFIX}-spaceOnBorders`,
};

const Root = styled('div')(({ theme }) => ({
  margin: 2, // NOTE: This is a fast fix for Grid containers with negative margins inside this component
  paddingTop: 25,
  paddingBottom: 25,
  paddingLeft: 10,
  paddingRight: 10,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 48,
    paddingBottom: 48,
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 90,
    paddingRight: 90,
  },
}));

export const ReactiveBorder = ({ children }: { children: React.ReactNode }) => {
  return <Root className={classes.spaceOnBorders}>{children}</Root>;
};
