import React from 'react';

import { Box } from '@mui/material';

export const Gap = ({
  x,
  y,
  inline,
}: {
  x?: number | string;
  y?: number | string;
  inline?: boolean;
}) => <Box ml={x} mt={y} display={inline ? 'inline' : undefined} />;
