import React from 'react';

import { Container, useMediaQuery, useTheme } from '@material-ui/core';

import { colors } from '#/src/colors';

const ContentWrapper = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Container
      style={{ backgroundColor: colors.white, maxWidth: '1600px' }}
      disableGutters={isMobile}>
      {props.children}
    </Container>
  );
};

export default ContentWrapper;
