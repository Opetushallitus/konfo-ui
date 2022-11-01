import React from 'react';

import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { educationTypeColorCode } from '#/src/colors';

const PREFIX = 'ColoredPaperContent';

const classes = {
  paper: `${PREFIX}-paper`,
};

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorOfBackground',
})(({ theme, colorOfBackground }) => ({
  [`& .${classes.paper}`]: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: colorOfBackground,
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
  },
}));

// Taustavärillinen "laatikko" koulutus, toteutus jne. sivuilla
export const ColoredPaperContent = ({
  children,
  backgroundColor = educationTypeColorCode.ammatillinenGreenBg,
}) => {
  return (
    <StyledBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      colorOfBackground={backgroundColor}>
      <Paper className={classes.paper}>{children}</Paper>
    </StyledBox>
  );
};
