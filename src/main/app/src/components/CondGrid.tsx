import React from 'react';

import { Grid } from '@mui/material';
import { GridProps } from '@mui/material/Grid';
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
