import React from 'react';

import { Box, Typography, BoxProps, useMediaQuery } from '@material-ui/core';

import { theme } from '#/src/theme';

import Spacer from './Spacer';

type Props = {
  heading: string;
  children: React.ReactNode;
} & BoxProps;

export const PageSection = ({ heading, children, ...props }: Props) => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      mt={isSmall ? 4 : 8}
      {...props}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      {children}
    </Box>
  );
};
