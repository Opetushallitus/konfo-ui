import React, { useContext } from 'react';

import { Typography, TypographyVariant, TypographyProps } from '@material-ui/core';

const HeadingLevelContext = React.createContext(0);

export const HeadingBoundary: React.FC = ({ children }) => {
  const level = useContext(HeadingLevelContext);

  return (
    <HeadingLevelContext.Provider value={level + 1}>
      {children}
    </HeadingLevelContext.Provider>
  );
};

export const Heading = ({ children, variant, ...props }: TypographyProps) => {
  const level = useContext(HeadingLevelContext);
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
