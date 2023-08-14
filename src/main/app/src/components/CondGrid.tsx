import React from 'react';

import { Grid, GridProps } from '@mui/material';
import { isEmpty } from 'lodash';

export const CondGrid = ({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<GridProps, 'children'>) => {
  return isEmpty(children) ? null : (
    <Grid container {...props}>
      {children}
    </Grid>
  );
};
