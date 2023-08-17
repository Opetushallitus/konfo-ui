import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

export type OutlinedButtonProps = Omit<ButtonProps, 'variant'> & {
  accentColor?: string;
};

export const OutlinedButton = React.forwardRef<HTMLButtonElement, OutlinedButtonProps>(
  ({ accentColor = 'transparent', color, sx, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant="outlined"
        sx={[
          {
            color,
            backgroundColor: accentColor,
            borderColor: color,
          },
          ...castArray(sx).filter(Boolean),
        ]}
      />
    );
  }
);
