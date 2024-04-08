import React from 'react';

import { BoxProps, TypographyVariant } from '@mui/material';

import { Heading, HeadingBoundary } from './Heading';
import { WithSideMargins } from './WithSideMargins';

export const ContentSection = ({
  heading,
  children,
  variant = 'h1',
  hasContent = true,
}: {
  heading?: string;
  variant?: TypographyVariant;
  hasContent?: boolean;
} & BoxProps) => {
  return (
    <WithSideMargins>
      {heading && children && hasContent ? (
        <>
          <Heading variant={variant}>{heading}</Heading>
          <HeadingBoundary>{children}</HeadingBoundary>
        </>
      ) : (
        children
      )}
    </WithSideMargins>
  );
};
