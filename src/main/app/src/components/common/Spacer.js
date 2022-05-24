import React from 'react';

import { makeStyles } from '@material-ui/core';

import { colors } from '#/src/colors';

const useStyles = makeStyles({
  root: (props) => ({
    height: '4px',
    width: '30px',
    borderRadius: '2px',
    backgroundColor: props.color ? props.color : colors.brandGreen,
    margin: '20px',
  }),
});

const Spacer = (props) => {
  const classes = useStyles(props);
  return <div className={classes.root} />;
};

export default Spacer;
