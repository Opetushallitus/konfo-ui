import React from 'react';

import Grid, { Grid2Props } from '@mui/material/Grid2';
import { isEmpty } from 'lodash';

export const CondGrid = ({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<Grid2Props, 'children'>) => {
  return isEmpty(children) ? null : (
    <Grid container {...props}>
      {children}
    </Grid>
  );
};
