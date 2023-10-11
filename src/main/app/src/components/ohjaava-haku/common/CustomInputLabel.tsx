import React from 'react';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CustomInputLabel = ({ translationKey }: { translationKey: string }) => {
  const { t } = useTranslation();

  return <Typography fontWeight="600">{t(translationKey)}</Typography>;
};
