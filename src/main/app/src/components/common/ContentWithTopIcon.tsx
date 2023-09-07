import React from 'react';

import { Avatar, Box } from '@mui/material';

import { colors, educationTypeColorCode } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'ContentWithTopIcon';

const classes = {
  container: `${PREFIX}-container`,
  box: `${PREFIX}-box`,
  avatar: `${PREFIX}-avatar`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
  },
  display: 'flex',
  justifyContent: 'center',

  [`& .${classes.box}`]: {
    textAlign: 'center',
    padding: theme.spacing(6, 12, 6, 12),
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 3, 3, 3),
    },
  },

  [`& .${classes.avatar}`]: {
    position: 'absolute',
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginTop: `calc(-${theme.spacing(8)} / 2)`,
    backgroundColor: colors.brandGreen,
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      marginTop: `calc(-${theme.spacing(6)} / 2)`,
    },
  },
}));

type Props = React.PropsWithChildren<{
  icon: React.ReactNode;
}>;

export const ContentWithTopIcon = ({ children, icon }: Props) => {
  return (
    <StyledBox className={classes.container}>
      <Avatar className={classes.avatar}>{icon}</Avatar>
      <Box className={classes.box}>{children}</Box>
    </StyledBox>
  );
};
