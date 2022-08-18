import React from 'react';

import { Box, Container, useMediaQuery, useTheme, makeStyles } from '@material-ui/core';

import { colors } from '#/src/colors';

const useStyles = makeStyles(() => ({
  wrapper: {
    backgroundColor: colors.white,
    maxWidth: '1600px',
    '& a': {
      color: colors.brandGreen,
      textDecoration: 'underline',
    },
  },
}));

const ContentWrapper = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Container className={classes.wrapper} disableGutters={isMobile}>
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
    </Container>
  );
};

export default ContentWrapper;
