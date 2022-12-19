import React, { useLayoutEffect } from 'react';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createGlobalState, useMeasure } from 'react-use';

import { useFilterProps, useSearch } from '#/src/components/haku/hakutulosHooks';
import { FILTER_TYPES } from '#/src/constants';

import { HakuKaynnissaSuodatin } from '../../suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '../../suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '../../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../../suodattimet/common/SijaintiSuodatin';
import {
  TyoelamaJaTaydennyskoulutuksetSuodatin,
  useTyoelamaSuodatinValues,
} from '../../suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { ValintatapaSuodatin } from '../../suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';

const PREFIX = 'Suodatinpalkki';

const classes = {
  rajaaTuloksia: `${PREFIX}-rajaaTuloksia`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: 300,
  },
}));

const useSuodatinpalkkiWidthState = createGlobalState(0);

export const useSuodatinpalkkiWidth = () => {
  const [width] = useSuodatinpalkkiWidthState();
  return width;
};

export const Suodatinpalkki = () => {
  const [, setWidth] = useSuodatinpalkkiWidthState();
  const [ref, { width: measuredWidth }] = useMeasure();
  const realWidth = Math.round(measuredWidth);
  const { setFilters } = useSearch();
  useLayoutEffect(() => {
    setWidth(realWidth);
    return () => setWidth(0);
  }, [setWidth, realWidth]);

  return (
    <StyledGrid ref={ref as any} item lg={3} md={4} className={classes.rajaaTuloksia}>
      <KoulutustyyppiSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI)}
        muuValues={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI_MUU)}
        setFilters={setFilters}
      />
      <OpetuskieliSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.OPETUSKIELI)}
        setFilters={setFilters}
      />
      <SijaintiSuodatin
        expanded
        elevation={2}
        kuntaValues={useFilterProps(FILTER_TYPES.KUNTA)}
        maakuntaValues={useFilterProps(FILTER_TYPES.MAAKUNTA)}
        setFilters={setFilters}
      />
      <PohjakoulutusvaatimusSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.POHJAKOULUTUSVAATIMUS)}
        setFilters={setFilters}
      />
      <HakuKaynnissaSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.HAKUKAYNNISSA)}
        setFilters={setFilters}
      />
      <TyoelamaJaTaydennyskoulutuksetSuodatin
        expanded
        elevation={2}
        values={useTyoelamaSuodatinValues()}
        setFilters={setFilters}
      />
      <HakutapaSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.HAKUTAPA)}
        setFilters={setFilters}
      />
      <ValintatapaSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.VALINTATAPA)}
        setFilters={setFilters}
      />
      <KoulutusalaSuodatin
        expanded
        elevation={2}
        values={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
        setFilters={setFilters}
      />
      <OpetustapaSuodatin
        expanded={false}
        elevation={2}
        values={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
        setFilters={setFilters}
      />
    </StyledGrid>
  );
};
