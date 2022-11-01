import React from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';

const PREFIX = 'TextWithBackground';

const classes = {
  textWithBackgroundBox: `${PREFIX}-textWithBackgroundBox`,
  textWithBackgroundText: `${PREFIX}-textWithBackgroundText`,
};

const StyledBox = styled(Box)({
  backgroundColor: colors.lightGreenBg,
  height: 'fit-content',
  [`& .${classes.textWithBackgroundText}`]: {
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.black,
    margin: '0 10px',
    lineHeight: '24px',
    whiteSpace: 'nowrap',
  },
});

export const TextWithBackground = (props: React.PropsWithChildren<object>) => {
  return (
    <StyledBox
      className={classes.textWithBackgroundBox}
      display="flex"
      justifyContent="center"
      justifyItems="center"
      component="span">
      <span className={classes.textWithBackgroundText}>{props.children}</span>
    </StyledBox>
  );
};
