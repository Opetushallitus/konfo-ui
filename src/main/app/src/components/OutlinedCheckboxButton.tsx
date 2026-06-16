import React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { MaterialSymbol } from '#/src/components/common/MaterialSymbol';

export type OutlinedCheckboxButtonProps = Omit<ButtonProps, 'variant' | 'color'> & {
  checked?: boolean;
};

export const OutlinedCheckboxButton = React.forwardRef<
  HTMLButtonElement,
  OutlinedCheckboxButtonProps
>(({ checked, ...props }, ref) => (
  <Button
    {...props}
    startIcon={
      <MaterialSymbol icon={checked ? 'check_box' : 'check_box_outline_blank'} />
    }
    ref={ref}
    variant="outlined"
    color="primary"
  />
));
