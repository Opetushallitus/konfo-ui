import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

import { styled } from '#/src/theme';

export type OutlinedButtonProps = Omit<ButtonProps, 'variant'> & {
  accentColor?: string;
  inverted?: boolean;
};

export const OutlinedButton = React.forwardRef<HTMLButtonElement, OutlinedButtonProps>(
  ({ accentColor = 'transparent', inverted = false, sx, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant="outlined"
        color={inverted ? 'inverted' : 'primary'}
        sx={[
          {
            backgroundColor: accentColor,
          },
          ...castArray(sx).filter(Boolean),
        ]}
      />
    );
  }
);

export const StyledOutlinedButton = styled(OutlinedButton)(
  ({ buttoncolor }: { buttoncolor: string }) => ({
    color: buttoncolor,
    borderColor: buttoncolor,
    borderWidth: '2px',
    fontWeight: 'bold',
    '&:hover': {
      borderWidth: '2px',
    },
  })
);
