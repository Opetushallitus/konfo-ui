import React from 'react';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useFilterProps, useSearch } from '#/src/components/haku/hakutulosHooks';
import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { TyoelamaJaTaydennyskoulutuksetSuodatin } from '#/src/components/suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { FILTER_TYPES } from '#/src/constants';
import { CheckboxRajainItem } from '#/src/types/SuodatinTypes';

import { Suodatin } from './Suodatin';
import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';
import { useTyoelamaSuodatinValues } from '../suodattimet/common/useTyoelamaSuodatinValues';

export const HakupalkkiFilters = () => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  return (
    <Box display="flex" flexWrap="wrap" padding="10px" justifyContent="center">
      <Suodatin id="koulutustyyppi" header={t('haku.koulutustyyppi')}>
        <KoulutustyyppiSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetuskieli')}>
        <OpetuskieliSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.OPETUSKIELI)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetusaika')}>
        <OpetusaikaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.OPETUSAIKA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="sijainti" header={t('haku.sijainti')}>
        <SijaintiSuodatin
          kuntaRajainValues={
            useFilterProps(FILTER_TYPES.KUNTA) as Array<CheckboxRajainItem>
          }
          maakuntaRajainValues={
            useFilterProps(FILTER_TYPES.MAAKUNTA) as Array<CheckboxRajainItem>
          }
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="pohjakoulutusvaatimus" header={t('haku.pohjakoulutusvaatimus')}>
        <PohjakoulutusvaatimusSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.POHJAKOULUTUSVAATIMUS)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakukaynnissa" header={t('haku.hakukaynnissa-otsikko')}>
        <HakuKaynnissaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.HAKUKAYNNISSA)}
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
          rajainValues={useTyoelamaSuodatinValues()}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakutapa" header={t('haku.hakutapa')}>
        <HakutapaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.HAKUTAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="valintatapa" header={t('haku.valintatapa')}>
        <ValintatapaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.VALINTATAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="koulutusala" header={t('haku.koulutusalat')}>
        <KoulutusalaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetustapa" header={t('haku.opetustapa')}>
        <OpetustapaSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="koulutuksenkesto" header={t('haku.koulutuksenkestokuukausina')}>
        <KoulutuksenKestoSuodatin
          setFilters={setFilters}
          rajainValues={useFilterProps(FILTER_TYPES.KOULUTUKSENKESTOKUUKAUSINA)}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="alkamiskausi" header={t('haku.alkamiskausi')}>
        <AlkamiskausiSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.ALKAMISKAUSI)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="maksullisuus" header={t('maksullisuus')}>
        <MaksullisuusSuodatin
          rajainValues={useFilterProps(FILTER_TYPES.MAKSULLISUUS)}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
    </Box>
  );
};
