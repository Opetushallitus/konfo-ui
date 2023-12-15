import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';

import { MaterialIcon } from './MaterialIcon';

type ExternalButtonProps = Pick<ButtonProps<'a'>, 'sx' | 'children' | 'disabled'> & {
  href: string;
};

export const ExternalLinkButton = ({
  sx,
  children,
  href,
  disabled,
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
    sx={[...castArray(sx).filter(Boolean)]}>
    {children}
  </Button>
);
