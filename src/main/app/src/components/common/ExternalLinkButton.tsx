import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

import { MaterialIcon } from './MaterialIcon';

export const ExternalLinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ sx, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      variant="contained"
      color="primary"
      size="medium"
      rel="noopener noreferrer"
      sx={[
        {
          fontWeight: 600,
        },
        ...castArray(sx).filter(Boolean),
      ]}>
      {props.children}
      <MaterialIcon icon="open_in_new" fontSize="small" sx={{ marginLeft: '0.4rem' }} />
    </Button>
  )
);
