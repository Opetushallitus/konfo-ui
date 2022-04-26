import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import SportsSoccer from '@material-ui/icons/SportsSoccer';
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

export const AdditionalInfoWithIcon = ({ translationKey }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Typography className={classes.text} variant="body1">
      <SportsSoccer className={classes.icon} />
      {t(translationKey)}
    </Typography>
  );
};
