import React from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

export const HakuLabel = ({ inverted = false }: { inverted?: boolean }) => {
  const { t } = useTranslation();

  const color = inverted ? 'white' : colors.grey900;
  const weight = inverted ? 'bold' : 'normal';

  return (
    <label
      htmlFor="searchbox-input"
      id="searchbox-label"
      style={{ color: color, fontWeight: weight }}>
      {t('haku.kehoite')}
    </label>
  );
};
