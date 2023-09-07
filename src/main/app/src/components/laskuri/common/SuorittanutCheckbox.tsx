import React from 'react';

import { FormControl, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { KonfoCheckbox } from '#/src/components/common/KonfoCheckbox';
import { styled } from '#/src/theme';

const SuorittanutControl = styled(FormControl)(() => ({
  width: '100%',
  margin: '1rem 0',
}));

type Props = {
  suorittanut: boolean;
  toggleSuorittanut: () => void;
};

export const SuorittanutCheckbox = ({ suorittanut, toggleSuorittanut }: Props) => {
  const { t } = useTranslation();
  return (
    <SuorittanutControl>
      <FormControlLabel
        control={<KonfoCheckbox checked={suorittanut} onClick={toggleSuorittanut} />}
        label={t('pistelaskuri.suoritan')}
      />
    </SuorittanutControl>
  );
};
