import React from 'react';

import { Box, Grid } from '@mui/material';

import { NDASH } from '#/src/constants';

export const Ndash = () => {
  return (
    <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
      <Box sx={{ fontSize: '1.5rem', marginBottom: '1.75rem' }}>{NDASH}</Box>
    </Grid>
  );
};
