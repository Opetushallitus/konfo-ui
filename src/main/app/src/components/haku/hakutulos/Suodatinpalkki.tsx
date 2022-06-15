import React, { useLayoutEffect } from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import { createGlobalState, useMeasure } from 'react-use';

import { useSearch } from '#/src/components/haku/hakutulosHooks';

import { HakutapaSuodatin } from '../../suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '../../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../../suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '../../suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';

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
  const { setFilters } = useSearch();
  useLayoutEffect(() => {
    setWidth(realWidth);
    return () => setWidth(0);
  }, [setWidth, realWidth]);

  return (
    <Grid ref={ref as any} item lg={3} md={4} className={classes.rajaaTuloksia}>
      <KoulutustyyppiSuodatin expanded elevation={2} setFilters={setFilters} />
      <OpetuskieliSuodatin expanded elevation={2} isHaku={true} setFilters={setFilters} />
      <SijaintiSuodatin expanded elevation={2} isHaku={true} setFilters={setFilters} />
      <PohjakoulutusvaatimusSuodatin
        expanded
        elevation={2}
        isHaku={true}
        setFilters={setFilters}
      />
      <HakutapaSuodatin expanded elevation={2} isHaku={true} setFilters={setFilters} />
      <ValintatapaSuodatin expanded elevation={2} isHaku={true} setFilters={setFilters} />
      <KoulutusalaSuodatin expanded elevation={2} setFilters={setFilters} />
      <OpetustapaSuodatin
        expanded={false}
        elevation={2}
        isHaku={true}
        setFilters={setFilters}
      />
    </Grid>
  );
};
