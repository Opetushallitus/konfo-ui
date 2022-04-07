import React from 'react';

import { Box, Typography, BoxProps } from '@material-ui/core';

import Spacer from './Spacer';

type Props = {
  heading: string;
  children: React.ReactNode;
} & BoxProps;

export const PageSection = ({ heading, children, ...props }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      mt={10}
      {...props}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      {children}
    </Box>
  );
};
