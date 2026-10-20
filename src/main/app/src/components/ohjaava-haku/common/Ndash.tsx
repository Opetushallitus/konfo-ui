import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { NDASH } from '#/src/constants';

export const Ndash = () => {
  return (
    <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
      <Box sx={{ fontSize: '1.5rem', marginBottom: '1.75rem' }}>{NDASH}</Box>
    </Grid>
  );
};
