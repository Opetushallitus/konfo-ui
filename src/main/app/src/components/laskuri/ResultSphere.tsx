import React from 'react';

import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VictoryContainer } from 'victory-core';
import { VictoryPie } from 'victory-pie';

import { colors } from '#/src/colors';
import { formatDouble } from '#/src/tools/utils';

import { ENSISIJAINEN_SCORE_BONUS, Osalasku } from './Keskiarvo';

const PREFIX = 'keskiarvo__tulos__pallerot__';

const classes = {
  resultSphere: `${PREFIX}pallero`,
  resultTextContainer: `${PREFIX}textcontainer`,
};

const PalleroContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  rowGap: '10px',
  width: '182px',
  height: '182px',
  margin: '22px auto 35px',
  textAlign: 'center',
  padding: '0 0.4rem',
  position: 'relative',
  [`& .${classes.resultTextContainer}`]: {
    zIndex: 5,
    position: 'absolute',
  },
}));

type ResultSphereProps = {
  results: Array<number>;
  text: string;
};

export const ResultSphere = ({ results, text }: ResultSphereProps) => {
  const resultWithComma = formatDouble(results.reduce((a, b) => a + b));
  const resultsData = results.map((val) => {
    return { x: '', y: val };
  });
  return (
    <PalleroContainer className={classes.resultSphere}>
      <VictoryPie
        width={320}
        innerRadius={95}
        data={resultsData}
        style={{ labels: { fillOpacity: 0 } }}
        colorScale={['#FFCC33', colors.brandGreen, colors.darkGrey, colors.kkMagenta]}
        containerComponent={<VictoryContainer responsive={false} />}></VictoryPie>
      <Box className={classes.resultTextContainer}>
        <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '5px' }}>
          {resultWithComma}
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </Box>
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
  osalasku: Osalasku;
};

export const ResultSpheres = ({ osalasku }: ResultSpheresProps) => {
  const { t } = useTranslation();

  return (
    <PallerotContainer>
      <ResultSphere
        results={[
          osalasku.kaikki,
          osalasku.taideTaitoAineet,
          6,
          ENSISIJAINEN_SCORE_BONUS,
        ]}
        text={t('pistelaskuri.pisteet.ammatillinen-first')}
      />
      <ResultSphere
        results={[osalasku?.kaikki, osalasku?.taideTaitoAineet, 6]}
        text={t('pistelaskuri.pisteet.ammatillinen-rest')}
      />
    </PallerotContainer>
  );
};
