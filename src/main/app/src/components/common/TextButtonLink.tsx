import { Button, buttonClasses, ButtonProps } from '@mui/material';

export type TextButtonLinkProps = Omit<ButtonProps<'a'>, 'variant' | 'disableRipple'> & {
  href: string;
};

export const TextButtonLink = (props: TextButtonLinkProps) => (
  <Button
    variant="text"
    disableRipple

    sx={{
      // Yhtenäinen ikonikoko: MUI pienentää startIconin ensimmäisen lapsen 20px:iin,
      // mutta esim. Badgeen kääritty ikoni jäisi muuten 24px:iin.
      [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
        fontSize: '24px',
      },
      '&:hover': {
        background: 'none',
        textDecoration: 'underline',
      },
    }}
    {...props}
  />
);
