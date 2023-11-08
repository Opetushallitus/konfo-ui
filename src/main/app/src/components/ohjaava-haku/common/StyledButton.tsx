import React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const AccessibleButton = styled(Button)({
  '&.Mui-focusVisible': {
    color: colors.black,
    background: colors.lightGrayishGreenBg,
    outline: `thick double ${colors.brandGreen}`,
  },
});

export const StyledButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }: ButtonProps, ref) => {
    return (
      <AccessibleButton disableFocusRipple {...props} ref={ref}>
        {children}
      </AccessibleButton>
    );
  }
);
