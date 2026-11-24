import React, { use } from 'react';

import { Typography, TypographyVariant, TypographyProps } from '@mui/material';

const HeadingLevelContext = React.createContext(0);

export const HeadingBoundary = ({ children }: React.PropsWithChildren) => {
  const level = use(HeadingLevelContext);

  return <HeadingLevelContext value={level + 1}>{children}</HeadingLevelContext>;
};

export const Heading = ({ children, variant, ...props }: TypographyProps) => {
  const level = use(HeadingLevelContext);
  if (level === 0) {
    throw Error('Heading used outside HeadingBoundary!');
  }

  const component = `h${Math.min(6, level)}`;

  return (
    <Typography
      aria-level={level}
      component={component as React.ElementType}
      variant={variant || (component as TypographyVariant)}
      {...props}>
      {children}
    </Typography>
  );
};
