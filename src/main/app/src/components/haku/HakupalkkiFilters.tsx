import React from 'react';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useSearch } from '#/src/components/haku/hakutulosHooks';
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

import { Suodatin } from './Suodatin';
import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';

export const HakupalkkiFilters = () => {
  const { t } = useTranslation();
  const { setFilters, rajainValues, rajainOptions } = useSearch();

  return (
    <Box display="flex" flexWrap="wrap" padding="10px" justifyContent="center">
      <Suodatin id="koulutustyyppi" header={t('haku.koulutustyyppi')}>
        <KoulutustyyppiSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetuskieli')}>
        <OpetuskieliSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetuskieli" header={t('haku.opetusaika')}>
        <OpetusaikaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="sijainti" header={t('haku.sijainti')}>
        <SijaintiSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="pohjakoulutusvaatimus" header={t('haku.pohjakoulutusvaatimus')}>
        <PohjakoulutusvaatimusSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakukaynnissa" header={t('haku.hakukaynnissa-otsikko')}>
        <HakuKaynnissaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
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
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="hakutapa" header={t('haku.hakutapa')}>
        <HakutapaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="valintatapa" header={t('haku.valintatapa')}>
        <ValintatapaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="koulutusala" header={t('haku.koulutusalat')}>
        <KoulutusalaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="opetustapa" header={t('haku.opetustapa')}>
        <OpetustapaSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="koulutuksenkesto" header={t('haku.koulutuksenkestokuukausina')}>
        <KoulutuksenKestoSuodatin
          setFilters={setFilters}
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="alkamiskausi" header={t('haku.alkamiskausi')}>
        <AlkamiskausiSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
      <Divider orientation="vertical" flexItem />
      <Suodatin id="maksullisuus" header={t('maksullisuus')}>
        <MaksullisuusSuodatin
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setFilters={setFilters}
          expanded={true}
          summaryHidden={true}
        />
      </Suodatin>
    </Box>
  );
};
