import React from 'react';

import { Link, LinkProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { MaterialIcon } from './MaterialIcon';
const PREFIX = 'ExternalLink';

const classes = {
  externalLinkIcon: `${PREFIX}-externalLinkIcon`,
};

const StyledLink = styled(Link)({
  [`& .${classes.externalLinkIcon}`]: {
    verticalAlign: 'middle',
    marginLeft: '5px',
    marginBottom: '1px',
  },
});

export const ExternalLink = ({ children, ...props }: LinkProps) => {
  return (
    <StyledLink target="_blank" variant="body1" {...props}>
      {children}
      <MaterialIcon name="open_in_new" />
    </StyledLink>
  );
};
