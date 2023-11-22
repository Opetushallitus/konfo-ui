import React from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ErrorMessage = ({ id, errorKey }: { id: string; errorKey: string }) => {
  const { t } = useTranslation();

  return (
    <Typography id={id} color="red" marginBottom="1rem">
      {t(`ohjaava-haku.error.${errorKey}`)}
    </Typography>
  );
};
