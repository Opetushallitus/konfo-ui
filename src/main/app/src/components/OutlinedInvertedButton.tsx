import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

export type OutlinedInvertedButtonProps = Omit<ButtonProps, 'variant' | 'color'> & {
  accentColor?: string;
};

export const OutlinedInvertedButton = React.forwardRef<
  HTMLButtonElement,
  OutlinedInvertedButtonProps
>(({ accentColor = 'transparent', sx, ...props }, ref) => (
  <Button
    {...props}
    ref={ref}
    variant="outlined"
    color="inverted"
    sx={[
      {
        color: 'white',
        backgroundColor: accentColor,
        borderColor: 'white',
      },
      ...castArray(sx).filter(Boolean),
    ]}
  />
));
