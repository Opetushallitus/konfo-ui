import React from 'react';

import { BoxProps, TypographyVariant } from '@mui/material';

import { Heading, HeadingBoundary } from './Heading';
import { WithSideMargins } from './WithSideMargins';

export const ContentSection = ({
  heading,
  children,
  variant = 'h1',
}: {
  heading?: string;
  variant?: TypographyVariant;
} & BoxProps) => {
  return (
    <WithSideMargins>
      {heading && children ? (
        <>
          <Heading sx={{ marginTop: '15px' }} variant={variant}>
            {heading}
          </Heading>
          <HeadingBoundary>{children}</HeadingBoundary>
        </>
      ) : (
        children
      )}
    </WithSideMargins>
  );
};
