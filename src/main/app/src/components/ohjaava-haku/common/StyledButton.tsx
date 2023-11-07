import { Button, ButtonProps } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

export const AccessibleButton = styled(Button)({
  '&.Mui-focusVisible': {
    color: colors.black,
    background: colors.lightGrayishGreenBg,
    outline: `thick double ${colors.brandGreen}`,
  },
});

export const StyledButton = ({ children, ...props }: ButtonProps) => {
  return (
    <AccessibleButton disableFocusRipple {...props}>
      {children}
    </AccessibleButton>
  );
};
