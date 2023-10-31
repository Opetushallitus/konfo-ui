import React from 'react';

import { useMediaQuery, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { StyledOutlinedButton } from '#/src/components/OutlinedButton';
import { theme } from '#/src/theme';

export const OhjaavaHakuLink = ({ inverted = false }: { inverted?: boolean }) => {
  const { t } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const color = inverted ? 'white' : colors.brandGreen;

  return isSmall ? (
    <Link
      href="/ohjaava-haku"
      sx={{ marginTop: '3px', color: color, textDecoration: 'underline' }}>
      {t('ohjaava-haku.otsikko')}
    </Link>
  ) : (
    <StyledOutlinedButton buttoncolor={color} href="/ohjaava-haku" inverted={inverted}>
      {t('ohjaava-haku.otsikko')}
    </StyledOutlinedButton>
  );
};
