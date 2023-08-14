import React from 'react';

import { Grid, GridProps } from '@mui/material';

export const CondGrid = ({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<GridProps, 'children'>) => {
  return children ? (
    <Grid container {...props}>
      {React.Children.map(children, (item) => (item ? <Grid item>{item}</Grid> : null))}
    </Grid>
  ) : null;
};
