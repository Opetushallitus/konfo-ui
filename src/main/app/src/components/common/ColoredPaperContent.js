import React from 'react';

import { Box, makeStyles, Paper } from '@material-ui/core';

import { educationTypeColorCode } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: ({ backgroundColor }) =>
      backgroundColor ?? educationTypeColorCode.ammatillinenGreenBg,
    [theme.breakpoints.down('lg')]: {
      width: '95%',
    },
  },
}));

// Taustavärillinen "laatikko" koulutus, toteutus jne. sivuilla
export const ColoredPaperContent = ({ children, ...props }) => {
  const classes = useStyles(props);
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Paper className={classes.paper}>{children}</Paper>
    </Box>
  );
};
