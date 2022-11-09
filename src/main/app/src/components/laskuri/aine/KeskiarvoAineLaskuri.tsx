import React from 'react';

import { Box, Typography, styled, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { KouluaineInput } from './KouluaineInput';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
};

const LaskuriContainer = styled(Box)(() => ({
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
  },
  [`& .${classes.error}`]: {
    color: colors.red,
    maxWidth: '60%',
  },
}));

type Props = {
  changeCalculator: (value: boolean) => void;
};

export const KeskiarvoAineLaskuri = ({ changeCalculator }: Props) => {
  const { t } = useTranslation();

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.aine.heading')}
      </Typography>
      <Typography>
        Voit myös{' '}
        <Button onClick={() => changeCalculator(true)}>arvioida keskiarvot itse.</Button>
      </Typography>
      <KouluaineInput aine="Äidinkieli"></KouluaineInput>
      <KouluaineInput aine="Matematiikka"></KouluaineInput>
    </LaskuriContainer>
  );
};
