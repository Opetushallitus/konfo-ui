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
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainName } from '#/src/types/common';

import { AmmOsaamisalatSuodatin } from './AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from './LukiolinjatSuodatin';
import { MobileRajainDrawer } from '../../common/MobileRajainDrawer';
import { AlkamiskausiSuodatin } from '../common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../common/OpetusaikaSuodatin';

type Props = {
  koulutustyyppi: string;
  values: any;
  rajainCount: number;
  hitCount: number;
  loading: boolean;
  clearChosenFilters: VoidFunction;
  setFilters: (value: any) => void;
  rajainValues: Partial<RajainValues>;
  rajainOptions: Record<RajainName, any>;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  rajainCount,
  values,
  hitCount,
  loading,
  clearChosenFilters,
  setFilters,
  rajainValues,
  rajainOptions,
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
          rajainUIValues={rajainValues}
          rajainOptions={rajainOptions}
          setFilters={setFilters}
        />
        <Divider />
        <OpetusaikaSuodatin
          expanded={false}
          rajainUIValues={rajainValues}
          rajainOptions={rajainOptions}
          setFilters={setFilters}
        />
        <Divider />
        <SijaintiSuodatin
          expanded={false}
          rajainUIValues={rajainValues}
          rajainOptions={rajainOptions}
          loading={loading}
          setFilters={setFilters}
        />
        <Divider />
        <PohjakoulutusvaatimusSuodatin
          expanded={false}
          rajainUIValues={rajainValues}
          rajainOptions={rajainOptions}
          setFilters={setFilters}
        />
        <Divider />
        {values.hakukaynnissa && (
          <HakuKaynnissaSuodatin
            expanded={false}
            rajainUIValues={rajainValues}
            rajainOptions={rajainOptions}
            setFilters={setFilters}
          />
        )}
        <Divider />
        {values.hakutapa && (
          <HakutapaSuodatin
            expanded={false}
            rajainUIValues={rajainValues}
            rajainOptions={rajainOptions}
            setFilters={setFilters}
          />
        )}
        <Divider />
        {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
          <>
            <ValintatapaSuodatin
              expanded={false}
              rajainUIValues={rajainValues}
              rajainOptions={rajainOptions}
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
              rajainUIValues={rajainValues}
              rajainOptions={rajainOptions}
              setFilters={setFilters}
            />
            <Divider />
            <LukiolinjatSuodatin
              name="lukiolinjat_er"
              expanded={false}
              rajainUIValues={rajainValues}
              rajainOptions={rajainOptions}
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
          rajainUIValues={rajainValues}
          rajainOptions={rajainOptions}
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
        <MaksullisuusSuodatin
          expanded={false}
          rajainValues={values.maksullisuus}
          setFilters={setFilters}
        />
        <Divider />
      </MobileRajainDrawer>
    </React.Fragment>
  );
};
