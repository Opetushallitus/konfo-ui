import React from 'react';

import { Box, BoxProps, TypographyVariant } from '@mui/material';

import { Heading } from './Heading';

export const ContentSection = ({
  heading,
  children,
  variant = 'h1',
}: {
  heading: string;
  variant?: TypographyVariant;
} & BoxProps) => {
  return (
    <Box>
      <Heading variant={variant}>{heading}</Heading>
      {children}
    </Box>
  );
};
