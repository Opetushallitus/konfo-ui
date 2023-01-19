import React from 'react';

import { Box, Typography, styled, useTheme, useMediaQuery } from '@mui/material';
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

const PalleroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  rowGap: '10px',
  width: '182px',
  height: '182px',
  margin: '26px auto 39px',
  textAlign: 'center',
  padding: '0 0.4rem',
  position: 'relative',
  [`& .${classes.resultTextContainer}`]: {
    zIndex: 5,
    position: 'absolute',
    [theme.breakpoints.down('lg')]: {
      width: '132px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '182px',
    },
  },
}));

type ResultSphereProps = {
  results: Array<number>;
  text: string;
  colorScales?: Array<string>;
};

export const ResultSphere = ({ results, text, colorScales }: ResultSphereProps) => {
  const resultWithComma = formatDouble(results.reduce((a, b) => a + b));
  const resultsData = results.map((val) => {
    return { x: '', y: val };
  });
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md')) && !isSmall;

  return (
    <PalleroContainer className={classes.resultSphere}>
      <VictoryPie
        width={isMedium ? 240 : 320}
        innerRadius={isMedium ? 85 : 95}
        data={resultsData}
        style={{ labels: { fillOpacity: 0 } }}
        colorScale={
          colorScales || [
            colors.sunglow,
            colors.brandGreen,
            colors.darkGrey,
            colors.kkMagenta,
          ]
        }
        containerComponent={<VictoryContainer responsive={false} />}
      />
      <Box className={classes.resultTextContainer}>
        <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '7px' }}>
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
  [theme.breakpoints.down('md')]: {
    rowGap: '0.3rem',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '13px auto',
    flexDirection: 'column',
    [`& .${classes.resultSphere}`]: {
      margin: '25px auto',
    },
  },
}));

type ResultSpheresAmmatillinenProps = {
  osalasku: Osalasku;
};

export const ResultSpheresAmmatillinen = ({
  osalasku,
}: ResultSpheresAmmatillinenProps) => {
  const { t } = useTranslation();

  return (
    <PallerotContainer>
      <ResultSphere
        results={[
          osalasku.kaikki,
          osalasku.taideTaitoAineet,
          osalasku?.suorittanutBonus,
          ENSISIJAINEN_SCORE_BONUS,
        ]}
        text={t('pistelaskuri.pisteet.ammatillinen-first')}
      />
      <ResultSphere
        results={[
          osalasku?.kaikki,
          osalasku?.taideTaitoAineet,
          osalasku?.suorittanutBonus,
        ]}
        text={t('pistelaskuri.pisteet.ammatillinen-rest')}
      />
    </PallerotContainer>
  );
};

type ResultSpheresLukioProps = {
  keskiarvo: number;
  painotettuKa: number;
};

export const ResultSpheresLukio = ({
  keskiarvo,
  painotettuKa,
}: ResultSpheresLukioProps) => {
  const { t } = useTranslation();

  return (
    <PallerotContainer>
      <ResultSphere results={[keskiarvo]} text={t('pistelaskuri.pisteet.lukio')} />
      <ResultSphere
        results={[painotettuKa]}
        text={t('pistelaskuri.pisteet.lukio-painotettu')}
        colorScales={[colors.kkMagenta]}
      />
    </PallerotContainer>
  );
};
