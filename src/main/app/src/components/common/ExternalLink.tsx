import React from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link, LinkBaseProps } from '@mui/material';
import { styled } from '@mui/material/styles';
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

export {};

export const ExternalLink = ({ children, ...props }: LinkBaseProps) => {
  return (
    <StyledLink target="_blank" variant="body1" {...props}>
      {children}
      <OpenInNewIcon className={classes.externalLinkIcon} />
    </StyledLink>
  );
};
