import React from 'react';

import { Box, Typography, styled, Paper } from '@mui/material';

import { colors } from '#/src/colors';

import { HakupisteLaskelma } from './Keskiarvo';

const PREFIX = 'keskiarvo__tulos__';

const classes = {
  column: `${PREFIX}column`,
  resultSphere: `${PREFIX}sphere`,
  spheresContainer: `${PREFIX}spheres`,
  textBlock: `${PREFIX}textblock`,
};

const TulosContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  [`& .${classes.column}`]: {
    width: '50vw',
  },
  [`& .${classes.resultSphere}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    rowGap: '10px',
    width: '182px',
    height: '182px',
    borderRadius: '50%',
    border: `2px solid #FFCC33`,
    margin: 'auto',
    textAlign: 'center',
    padding: '0 0.4rem',
  },
  [`& .${classes.spheresContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
  },
  [`& .${classes.textBlock}`]: {
    background: colors.greyBg,
    padding: '1rem',
  },
}));

type ResultSphereProps = {
  result: number;
  text: string;
};

const ResultSphere = ({ result, text }: ResultSphereProps) => {
  return (
    <Box className={classes.resultSphere}>
      <Typography sx={{ fontSize: '3rem' }}>{result}</Typography>
      <Typography sx={{ fontSize: '0.875rem' }} variant="body2">
        {text}
      </Typography>
    </Box>
  );
};

type Props = {
  tulos: HakupisteLaskelma;
};

const lukioText = `Lukioon pääsyn ratkaisee peruskoulun päättötodistuksen lukuaineiden keskiarvo.
          
Joillain lukion linjoilla, joissa on tietty painotus (esim. lukion urheilulinja), voi lisäksi olla pääsykoe tai lisänäyttö, joista annetaan pisteitä. Joillain linjoilla voidaan painottaa keskiarvolaskennassa tiettyä oppiainetta. Tarkista valintaperusteet hakukohteen sivulta.`;

export const KeskiarvoTulos = ({ tulos }: Props) => {
  return (
    <TulosContainer>
      <Box className={classes.column}>
        <Typography variant="h3">Lukuaineiden keskiarvo lukioon hakua varten</Typography>
        <ResultSphere
          result={tulos.keskiarvo}
          text="lukuaineiden keskiarvo"></ResultSphere>
        <Paper className={classes.textBlock} elevation={0}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {lukioText}
          </Typography>
        </Paper>
      </Box>
      <Box className={classes.column}>
        <Typography variant="h3">Ammatillisen koulutuksen hakupisteet</Typography>
        <Box className={classes.spheresContainer}>
          <ResultSphere
            result={tulos.pisteet + 2}
            text="Ensisijaisen hakukohteen pisteet"></ResultSphere>
          <ResultSphere
            result={tulos.pisteet}
            text="2. - 7. hakukohteen pisteet"></ResultSphere>
        </Box>
        <Paper className={classes.textBlock} elevation={0}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {lukioText}
          </Typography>
        </Paper>
      </Box>
    </TulosContainer>
  );
};
