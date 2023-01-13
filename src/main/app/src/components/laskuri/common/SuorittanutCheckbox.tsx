import React from 'react';

import { FormControl, FormControlLabel, styled } from '@mui/material';

import { KonfoCheckbox } from '../../common/Checkbox';

const SuorittanutControl = styled(FormControl)(() => ({
  margin: '1rem 0',
}));

type Props = {
  suorittanut: boolean;
  toggleSuorittanut: () => void;
};

export const SuorittanutCheckbox = ({ suorittanut, toggleSuorittanut }: Props) => {
  return (
    <SuorittanutControl>
      <FormControlLabel
        control={<KonfoCheckbox checked={suorittanut} onClick={toggleSuorittanut} />}
        label={
          'Olen suorittanut/suoritan peruskoulun, TUVA-koulutuksen tai oppivelvollisten linjan hakuvuonna.'
        }
      />
    </SuorittanutControl>
  );
};
