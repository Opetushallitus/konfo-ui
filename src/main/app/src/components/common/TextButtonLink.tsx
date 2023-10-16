import { Button, lighten, ButtonProps } from '@mui/material';

import { colors } from '#/src/colors';

export const TextButtonLink = (
  props: Omit<ButtonProps<'a'>, 'variant' | 'disableRipple'> & { href: string }
) => (
  <Button
    variant="text"
    disableRipple
    sx={{
      fontSize: 'inherit',
      textDecoration: 'underline',
      textDecorationColor: lighten(colors.brandGreen, 0.6),
      '&:hover': {
        background: 'none',
        textDecoration: 'underline',
        textDecorationColor: colors.brandGreen,
      },
    }}
    {...props}
  />
);
