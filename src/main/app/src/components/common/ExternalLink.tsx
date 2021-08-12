import React from 'react';

import { Link, LinkBaseProps, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

export const useStyles = makeStyles({
  externalLinkIcon: { verticalAlign: 'middle', marginLeft: '5px', marginBottom: '1px' },
});

export const ExternalLink = ({ children, ...props }: LinkBaseProps) => {
  const classes = useStyles();
  return (
    <Link variant="body1" {...props}>
      {children}
      <OpenInNewIcon className={classes.externalLinkIcon} />
    </Link>
  );
};
