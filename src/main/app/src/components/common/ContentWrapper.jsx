import React from 'react';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

import { colors } from '#/src/colors';
import { useScrollToHash } from '#/src/hooks/useScrollToHash';
import { styled } from '#/src/theme';

const PREFIX = 'ContentWrapper';

const classes = {
  wrapper: `${PREFIX}-wrapper`,
};

const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'additionalStylesFn',
})(({ theme, additionalStylesFn = () => {} }) => ({
  ...additionalStylesFn({ theme }),

  backgroundColor: colors.white,
  maxWidth: '1600px',
  '& a[!class]': {
    color: colors.brandGreen,
    textDecoration: 'underline',
  },
}));

export const ContentWrapper = (props) => {
  const theme = useTheme();
  useScrollToHash();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <StyledContainer
      additionalStylesFn={props.additionalStylesFn}
      className={classes.wrapper}
      disableGutters={isMobile}>
      <Box
        margin="auto"
        paddingLeft={1}
        paddingRight={1}
        maxWidth="1200px"
        display="flex"
        flexDirection="column"
        alignItems="center">
        {props.children}
      </Box>
    </StyledContainer>
  );
};
