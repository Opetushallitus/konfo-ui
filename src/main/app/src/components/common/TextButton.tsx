import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  textButton: {
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
    fontFamily: 'Open Sans',
  },
}));

export const TextButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const classes = useStyles();
  return <button className={classes.textButton} {...props} />;
};
