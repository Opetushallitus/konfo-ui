import React from 'react';

import { SearchOutlined } from '@mui/icons-material';
import { IconButton, Button, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { theme } from '#/src/theme';

export const SearchButton = ({ isKeywordValid }: { isKeywordValid: boolean }) => {
  const { t } = useTranslation();

  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  return mdUp ? (
    <Button
      startIcon={<SearchOutlined />}
      disabled={!isKeywordValid}
      type="submit"
      variant="contained"
      color="secondary"
      sx={{
        display: 'inline-flex',
        flexShrink: 0,
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'center',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      }}>
      {t('haku.etsi')}
    </Button>
  ) : (
    <IconButton
      disabled={!isKeywordValid}
      type="submit"
      sx={{ marginRight: theme.spacing(1) }}
      aria-label={t('haku.etsi')}>
      <SearchOutlined />
    </IconButton>
  );
};
