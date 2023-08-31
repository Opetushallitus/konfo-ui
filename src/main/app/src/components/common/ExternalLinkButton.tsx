import React from 'react';

import { Button, SxProps } from '@mui/material';
import { castArray } from 'lodash';

import { MaterialIcon } from './MaterialIcon';

type ExternalButtonProps = {
  sx?: SxProps;
  children: React.ReactNode;
  href: string;
};

export const ExternalLinkButton = ({ sx, children, href }: ExternalButtonProps) => (
  <Button
    variant="contained"
    color="primary"
    size="medium"
    rel="noopener noreferrer"
    href={href}
    aria-label={href}
    target="_blank"
    sx={[
      {
        fontWeight: 600,
      },
      ...castArray(sx).filter(Boolean),
    ]}>
    {children}
    <MaterialIcon
      icon="open_in_new"
      fontSize="small"
      sx={{ marginLeft: '0.4rem' }}
      aria-hidden="true"
    />
  </Button>
);
