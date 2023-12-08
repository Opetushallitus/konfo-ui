import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

import { MaterialIcon } from './MaterialIcon';

type ExternalButtonProps = Pick<
  ButtonProps<'a'>,
  'sx' | 'children' | 'disabled' | 'onClick'
> & {
  href: string;
};

export const ExternalLinkButton = ({
  sx,
  children,
  href,
  disabled,
  onClick,
}: ExternalButtonProps) => (
  <Button
    variant="contained"
    color="primary"
    rel="noopener noreferrer"
    href={href}
    endIcon={<MaterialIcon icon="open_in_new" aria-hidden="true" />}
    aria-label={href}
    target="_blank"
    disabled={disabled}
    onClick={onClick}
    sx={[...castArray(sx).filter(Boolean)]}>
    {children}
  </Button>
);
