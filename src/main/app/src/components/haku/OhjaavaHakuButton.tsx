import React from 'react';

import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const OhjaavaHakuButton = () => {
  const PREFIX = 'OhjaavaHakuButton';
  const classes = {
    clearButton: `${PREFIX}clearbutton`,
  };
  const { t } = useTranslation();
  return (
    <Button className={classes.clearButton} variant="outlined" color="primary">
      {t('ohjaava-haku.minne-hakisin')}
    </Button>
  );
};
