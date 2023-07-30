import React from 'react';

import { Link, LinkProps } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';

export const ExternalLink = ({ children, ...props }: LinkProps) => (
  <Link target="_blank" variant="body1" {...props}>
    {children}
    <MaterialIcon
      icon="open_in_new"
      sx={{
        verticalAlign: 'middle',
        marginLeft: '5px',
        marginBottom: '1px',
      }}
    />
  </Link>
);
