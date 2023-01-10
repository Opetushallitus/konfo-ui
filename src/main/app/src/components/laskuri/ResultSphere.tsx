import React from 'react';

import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { formatDouble } from '#/src/tools/utils';

import { ENSISIJAINEN_SCORE_BONUS, HakupisteLaskelma } from './Keskiarvo';

const PREFIX = 'keskiarvo__tulos__pallerot__';

const classes = {
  resultSphere: `${PREFIX}pallero`,
};

const PalleroContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  rowGap: '10px',
  width: '182px',
  height: '182px',
  borderRadius: '50%',
  border: `2px solid #FFCC33`,
  margin: '13px auto 27px',
  textAlign: 'center',
  padding: '0 0.4rem',
}));

type ResultSphereProps = {
  result: number;
  text: string;
};

export const ResultSphere = ({ result, text }: ResultSphereProps) => {
  const resultWithComma = formatDouble(result);
  return (
    <PalleroContainer className={classes.resultSphere}>
      <Typography sx={{ fontSize: '3rem', fontWeight: 'bold' }}>
        {resultWithComma}
      </Typography>
      <Typography variant="body2">{text}</Typography>
    </PalleroContainer>
  );
};

const PallerotContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: '1rem',
  [theme.breakpoints.down('sm')]: {
    margin: '13px auto',
    flexDirection: 'column',
    [`& .${classes.resultSphere}`]: {
      margin: '0 auto',
    },
  },
}));

type ResultSpheresProps = {
  tulos: HakupisteLaskelma;
};

export const ResultSpheres = ({ tulos }: ResultSpheresProps) => {
  const { t } = useTranslation();

  return (
    <PallerotContainer>
      <ResultSphere
        result={tulos.pisteet + ENSISIJAINEN_SCORE_BONUS}
        text={t('pistelaskuri.pisteet.ammatillinen-first')}
      />
      <ResultSphere
        result={tulos.pisteet}
        text={t('pistelaskuri.pisteet.ammatillinen-rest')}
      />
    </PallerotContainer>
  );
};
