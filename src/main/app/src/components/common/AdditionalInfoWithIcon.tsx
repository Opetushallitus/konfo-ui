import React from 'react';

import { makeStyles, Typography, Icon } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

const useStyles = makeStyles({
  text: {
    color: colors.brandGreen,
    fontWeight: 600,
    paddingBottom: '8px',
  },
  icon: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
  },
});

type Props = {
  translationKey: string;
  icon: React.ReactNode;
};

export const AdditionalInfoWithIcon = ({ translationKey, icon }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Typography className={classes.text} variant="body1">
      <Icon className={classes.icon}>{icon}</Icon>
      {t(translationKey)}
    </Typography>
  );
};
