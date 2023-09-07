import React from 'react';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSearch } from '#/src/components/haku/hakutulosHooks';

import { AlkamiskausiSuodatin } from '../../suodattimet/common/AlkamiskausiSuodatin';
import { HakuKaynnissaSuodatin } from '../../suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '../../suodattimet/common/HakutapaSuodatin';
import { KoulutuksenKestoSuodatin } from '../../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../../suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '../../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../../suodattimet/common/SijaintiSuodatin';
import { TyoelamaJaTaydennyskoulutuksetSuodatin } from '../../suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
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

export const Suodatinpalkki = () => {
  const { setFilters, rajainValues, rajainOptions } = useSearch();

  return (
    <StyledGrid item lg={3} md={4} className={classes.rajaaTuloksia}>
      <KoulutustyyppiSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <OpetuskieliSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <OpetusaikaSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <SijaintiSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <PohjakoulutusvaatimusSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <HakuKaynnissaSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <TyoelamaJaTaydennyskoulutuksetSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <HakutapaSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <ValintatapaSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <KoulutusalaSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <OpetustapaSuodatin
        expanded={false}
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <KoulutuksenKestoSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <AlkamiskausiSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
      <MaksullisuusSuodatin
        expanded
        elevation={2}
        rajainUIValues={rajainValues}
        rajainOptions={rajainOptions}
        setFilters={setFilters}
      />
    </StyledGrid>
  );
};
