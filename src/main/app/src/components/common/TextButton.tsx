import React from 'react';

import { styled } from '#/src/theme';
const PREFIX = 'TextButton';

const classes = {
  textButton: `${PREFIX}-textButton`,
};

const Root = styled('button')(({ theme }) => ({
  [`&.${classes.textButton}`]: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline',
    padding: 0,
    margin: '35px 0 0',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: '1.375rem',
    color: theme.palette.primary.main,
  },
}));

export const TextButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  return <Root className={classes.textButton} {...props} />;
};
