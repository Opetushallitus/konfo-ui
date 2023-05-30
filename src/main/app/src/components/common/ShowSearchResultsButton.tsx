import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from '#/src/theme';

export const ShowSearchResultsButton = ({
  color = 'primary',
  variant = 'contained',
  hitCount = 0,
  ...rest
}: { hitCount?: number } & ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      sx={{
        fontWeight: 600,
        alignSelf: 'center',
        margin: theme.spacing(4),
      }}
      color={color}
      variant={variant}
      {...rest}>
      {t('haku.nayta-hakutulos', { count: hitCount })}
    </Button>
  );
};
