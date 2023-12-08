import React from 'react';

import { Button, ButtonProps } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const AccessibleButton = styled(Button)({
  fontSize: '1rem',

  '&.Mui-focusVisible': {
    color: colors.grey900,
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
