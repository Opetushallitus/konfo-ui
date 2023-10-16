import { Button, lighten, ButtonProps } from '@mui/material';

import { colors } from '#/src/colors';

export type TextButtonLinkProps = Omit<ButtonProps<'a'>, 'variant' | 'disableRipple'> & {
  href: string;
};

export const TextButtonLink = (props: TextButtonLinkProps) => (
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
