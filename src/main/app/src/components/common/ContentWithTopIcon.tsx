import React from 'react';

import { Avatar, Box, makeStyles } from '@material-ui/core';
import DirectionsOutlinedIcon from '@material-ui/icons/DirectionsOutlined';

import { colors, educationTypeColorCode } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(4),
    },
    display: 'flex',
    justifyContent: 'center',
  },
  box: {
    textAlign: 'center',
    padding: theme.spacing(6, 12, 6, 12),
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 3, 3, 3),
    },
  },
  avatar: {
    position: 'absolute',
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginTop: -theme.spacing(8) / 2,
    backgroundColor: colors.brandGreen,
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      marginLeft: -theme.spacing(6) / 2,
      marginTop: -theme.spacing(6) / 2,
    },
  },
}));

export const ContentWithTopIcon: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Avatar className={classes.avatar}>
        <DirectionsOutlinedIcon />
      </Avatar>
      <Box className={classes.box}>{children}</Box>
    </Box>
  );
};
