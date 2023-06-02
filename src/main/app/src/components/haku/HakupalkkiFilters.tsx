import React from 'react';

import { Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useFilterProps, useSearch } from '#/src/components/haku/hakutulosHooks';
import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import {
  TyoelamaJaTaydennyskoulutuksetSuodatin,
  useTyoelamaSuodatinValues,
} from '#/src/components/suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { FILTER_TYPES } from '#/src/constants';

import { Suodatin } from './Suodatin';
import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';

const PREFIX = 'HakupalkkiFilters';

const classes = {
  container: `${PREFIX}-container`,
};

const StyledBox = styled(Box)(() => ({
  padding: '10px',
}));

export const HakupalkkiFilters = () => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  return (
    <StyledBox
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      className={classes.container}>
      <Suodatin id="koulutustyyppi" header={t('haku.koulutustyyppi')}>
        <KoulutustyyppiSuodatin
          values={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI)}
          muuValues={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI_MUU)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetuskieli')}>
        <OpetuskieliSuodatin
          values={useFilterProps(FILTER_TYPES.OPETUSKIELI)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetusaika')}>
        <OpetusaikaSuodatin
          values={useFilterProps(FILTER_TYPES.OPETUSAIKA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="sijainti" header={t('haku.sijainti')}>
        <SijaintiSuodatin
          kuntaValues={useFilterProps(FILTER_TYPES.KUNTA)}
          maakuntaValues={useFilterProps(FILTER_TYPES.MAAKUNTA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="pohjakoulutusvaatimus" header={t('haku.pohjakoulutusvaatimus')}>
        <PohjakoulutusvaatimusSuodatin
          values={useFilterProps(FILTER_TYPES.POHJAKOULUTUSVAATIMUS)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakukaynnissa" header={t('haku.hakukaynnissa-otsikko')}>
        <HakuKaynnissaSuodatin
          values={useFilterProps(FILTER_TYPES.HAKUKAYNNISSA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin
        id="tyoelama-ja-taydennyskoulutukset-filter"
        header={t('haku.tyoelama-ja-taydennyskoulutukset')}>
        <TyoelamaJaTaydennyskoulutuksetSuodatin
          values={useTyoelamaSuodatinValues()}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakutapa" header={t('haku.hakutapa')}>
        <HakutapaSuodatin
          values={useFilterProps(FILTER_TYPES.HAKUTAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="valintatapa" header={t('haku.valintatapa')}>
        <ValintatapaSuodatin
          values={useFilterProps(FILTER_TYPES.VALINTATAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="koulutusala" header={t('haku.koulutusalat')}>
        <KoulutusalaSuodatin
          values={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetustapa" header={t('haku.opetustapa')}>
        <OpetustapaSuodatin
          values={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="alkamiskausi" header={t('haku.alkamiskausi')}>
        <AlkamiskausiSuodatin
          values={useFilterProps(FILTER_TYPES.ALKAMISKAUSI)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
    </StyledBox>
  );
};
