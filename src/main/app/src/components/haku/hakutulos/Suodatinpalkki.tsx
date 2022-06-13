import React, { useLayoutEffect } from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import { createGlobalState, useMeasure } from 'react-use';

import { HakutapaSuodatin } from '../../suodattimet/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '../../suodattimet/OpetusKieliSuodatin';
import { ValintatapaSuodatin } from '../../suodattimet/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from './hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from './hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetustapaSuodatin } from '../../suodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from './hakutulosSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from './hakutulosSuodattimet/SijaintiSuodatin';

const useSuodatinpalkkiWidthState = createGlobalState(0);

export const useSuodatinpalkkiWidth = () => {
  const [width] = useSuodatinpalkkiWidthState();
  return width;
};

const useStyles = makeStyles((theme) => ({
  rajaaTuloksia: {
    [theme.breakpoints.up('sm')]: {
      'min-width': 300,
    },
  },
}));

export const Suodatinpalkki = () => {
  const classes = useStyles();
  const [, setWidth] = useSuodatinpalkkiWidthState();
  const [ref, { width: measuredWidth }] = useMeasure();
  const realWidth = Math.round(measuredWidth);
  useLayoutEffect(() => {
    setWidth(realWidth);
    return () => setWidth(0);
  }, [setWidth, realWidth]);

  return (
    <Grid ref={ref as any} item lg={3} md={4} className={classes.rajaaTuloksia}>
      <KoulutustyyppiSuodatin expanded elevation={2} />
      <OpetuskieliSuodatin expanded elevation={2} isHaku={true} />
      <SijaintiSuodatin expanded elevation={2} />
      <PohjakoulutusvaatimusSuodatin expanded elevation={2} />
      <HakutapaSuodatin expanded elevation={2} isHaku={true} />
      <ValintatapaSuodatin expanded elevation={2} isHaku={true} />
      <KoulutusalaSuodatin expanded elevation={2} />
      <OpetustapaSuodatin expanded={false} elevation={2} isHaku={true} />
    </Grid>
  );
};
