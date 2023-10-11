import React from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Error = ({ errorKey }: { errorKey: string }) => {
  const { t } = useTranslation();

  return <Typography color="red">{t(`ohjaava-haku.error.${errorKey}`)}</Typography>;
};
