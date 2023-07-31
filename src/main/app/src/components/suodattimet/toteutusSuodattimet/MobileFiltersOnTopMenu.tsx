import React, { useCallback, useState } from 'react';

import { Box, Divider } from '@mui/material';
import { t } from 'i18next';

import { colors } from '#/src/colors';
import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';

import { AmmOsaamisalatSuodatin } from './AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from './LukiolinjatSuodatin';
import { MobileRajainDrawer } from '../../common/MobileRajainDrawer';
import { AlkamiskausiSuodatin } from '../common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../common/KoulutuksenKestoSuodatin';
import { OpetusaikaSuodatin } from '../common/OpetusaikaSuodatin';

type Props = {
  koulutustyyppi: string;
  values: any;
  rajainCount: number;
  hitCount: number;
  loading: boolean;
  clearChosenFilters: VoidFunction;
  setFilters: (value: any) => void;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  rajainCount,
  values,
  hitCount,
  loading,
  clearChosenFilters,
  setFilters,
}: Props) => {
  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  return (
    <React.Fragment>
      {!showFilters && (
        <Box marginBottom={1}>
          <FilterSearchResultsButton
            inline={true}
            textColor={colors.brandGreen}
            chosenFilterCount={rajainCount}
            onClick={toggleShowFilters}>
            {t('haku.rajaa-tuloksia')}
          </FilterSearchResultsButton>
        </Box>
      )}
      <MobileRajainDrawer
        isOpen={showFilters}
        toggleOpen={toggleShowFilters}
        showResults={toggleShowFilters}
        clearRajainSelection={clearChosenFilters}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        <OpetuskieliSuodatin
          expanded={false}
          rajainValues={values.opetuskieli}
          setFilters={setFilters}
        />
        <Divider />
        <OpetusaikaSuodatin
          expanded={false}
          rajainValues={values.opetusaika}
          setFilters={setFilters}
        />
        <Divider />
        <SijaintiSuodatin
          expanded={false}
          maakuntaRajainValues={values.maakunta}
          kuntaRajainValues={values.kunta}
          loading={loading}
          setFilters={setFilters}
        />
        <Divider />
        <PohjakoulutusvaatimusSuodatin
          expanded={false}
          rajainValues={values.pohjakoulutusvaatimus}
          setFilters={setFilters}
        />
        <Divider />
        {values.hakukaynnissa && (
          <HakuKaynnissaSuodatin
            expanded={false}
            rajainValues={values.hakukaynnissa}
            setFilters={setFilters}
          />
        )}
        <Divider />
        {values.hakutapa && (
          <HakutapaSuodatin
            expanded={false}
            rajainValues={values.hakutapa}
            setFilters={setFilters}
          />
        )}
        <Divider />
        {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
          <>
            <ValintatapaSuodatin
              expanded={false}
              rajainValues={values.valintatapa}
              setFilters={setFilters}
            />
            <Divider />
          </>
        )}
        {koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && (
          <>
            <LukiolinjatSuodatin
              name="lukiopainotukset"
              expanded={false}
              rajainValues={values.lukiopainotukset}
              setFilters={setFilters}
            />
            <Divider />
            <LukiolinjatSuodatin
              name="lukiolinjat_er"
              expanded={false}
              rajainValues={values.lukiolinjaterityinenkoulutustehtava}
              setFilters={setFilters}
            />
            <Divider />
          </>
        )}
        {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
          <>
            <AmmOsaamisalatSuodatin
              expanded={false}
              rajainValues={values.osaamisala}
              setFilters={setFilters}
            />
            <Divider />
          </>
        )}
        <OpetustapaSuodatin
          expanded={false}
          rajainValues={values.opetustapa}
          setFilters={setFilters}
        />
        <Divider />
        <KoulutuksenKestoSuodatin
          expanded={false}
          rajainValues={values.koulutuksenkestokuukausina}
          setFilters={setFilters}
        />
        <Divider />
        <AlkamiskausiSuodatin
          expanded={false}
          rajainValues={values.alkamiskausi}
          setFilters={setFilters}
        />
        <Divider />
      </MobileRajainDrawer>
    </React.Fragment>
  );
};
