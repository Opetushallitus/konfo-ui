import React from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ErrorMessage = ({ errorKey }: { errorKey: string }) => {
  const { t } = useTranslation();

  return (
    <Typography color="red" marginBottom="1rem">
      {t(`ohjaava-haku.error.${errorKey}`)}
    </Typography>
  );
};
