import React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

export type OutlinedCheckboxButtonProps = Omit<ButtonProps, 'variant' | 'color'> & {
  checked?: boolean;
};

export const OutlinedCheckboxButton = React.forwardRef<
  HTMLButtonElement,
  OutlinedCheckboxButtonProps
>(({ checked, ...props }, ref) => (
  <Button
    {...props}
    startIcon={<MaterialIcon icon={checked ? 'check_box' : 'check_box_outline_blank'} />}
    ref={ref}
    variant="outlined"
    color="primary"
  />
));
