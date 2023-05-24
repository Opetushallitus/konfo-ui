import React, { useCallback, useMemo, useState } from 'react';

import { Divider } from '@mui/material';

import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import {
  TyoelamaJaTaydennyskoulutuksetSuodatin,
  useTyoelamaSuodatinValues,
} from '#/src/components/suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { FILTER_TYPES } from '#/src/constants';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { HakuKaynnissaSuodatin } from '../suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '../suodattimet/common/HakutapaSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '../suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '../suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '../suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { MobileResultsPerPageExpansionMenu } from './hakutulos/MobileResultsPerPageExpansionMenu';
import MobileToggleKoulutusOppilaitos from './hakutulos/MobileToggleKoulutusOppilaitos';
import MobileToggleOrderByButtonMenu from './hakutulos/MobileToggleOrderByButtonMenu';
import { useAllSelectedFilters, useFilterProps, useSearch } from './hakutulosHooks';

export const MobileFiltersOnTopMenu = ({
  isButtonInline = false,
}: {
  isButtonInline?: boolean;
}) => {
  const isAtEtusivu = useIsAtEtusivu();

  const {
    koulutusData,
    oppilaitosData,
    selectedTab,
    clearFilters,
    goToSearchPage,
    setFilters,
  } = useSearch();

  const hitCount = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusData?.total : oppilaitosData?.total),
    [selectedTab, koulutusData, oppilaitosData]
  );

  const { flat: allSelectedFilters } = useAllSelectedFilters();
  const rajainCount = allSelectedFilters?.length ?? 0;

  const [showFilters, setShowFilters] = useState(false);
  const onToggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  const onShowResults = () => {
    if (isAtEtusivu) {
      goToSearchPage();
    }
    onToggleShowFilters();
  };

  return (
    <>
      {!showFilters && (
        <FilterSearchResultsButton
          inline={isButtonInline}
          textColor="white"
          chosenFilterCount={rajainCount}
          onClick={onToggleShowFilters}
        />
      )}
      <MobileRajainDrawer
        isOpen={showFilters}
        toggleOpen={onToggleShowFilters}
        showResults={onShowResults}
        clearRajainSelection={clearFilters}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        {isAtEtusivu && <MobileToggleKoulutusOppilaitos />}
        {isAtEtusivu && <Divider />}
        <KoulutustyyppiSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI)}
          muuValues={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI_MUU)}
          setFilters={setFilters}
        />
        <Divider />
        <OpetuskieliSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.OPETUSKIELI)}
          setFilters={setFilters}
        />
        <Divider />
        <OpetusaikaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.OPETUSAIKA)}
          setFilters={setFilters}
        />
        <Divider />
        <SijaintiSuodatin
          expanded={false}
          displaySelected
          kuntaValues={useFilterProps(FILTER_TYPES.KUNTA)}
          maakuntaValues={useFilterProps(FILTER_TYPES.MAAKUNTA)}
          setFilters={setFilters}
        />
        <Divider />
        <PohjakoulutusvaatimusSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.POHJAKOULUTUSVAATIMUS)}
          setFilters={setFilters}
        />
        <Divider />
        <HakuKaynnissaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.HAKUKAYNNISSA)}
          setFilters={setFilters}
        />
        <Divider />
        <TyoelamaJaTaydennyskoulutuksetSuodatin
          expanded={false}
          displaySelected
          values={useTyoelamaSuodatinValues()}
          setFilters={setFilters}
        />
        <Divider />
        <HakutapaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.HAKUTAPA)}
          setFilters={setFilters}
        />
        <Divider />
        <ValintatapaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.VALINTATAPA)}
          setFilters={setFilters}
        />
        <Divider />
        <KoulutusalaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
          setFilters={setFilters}
        />
        <Divider />
        <OpetustapaSuodatin
          expanded={false}
          displaySelected
          values={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
          setFilters={setFilters}
        />
        <Divider />
        {!isAtEtusivu && <MobileToggleOrderByButtonMenu />}
        {!isAtEtusivu && <MobileResultsPerPageExpansionMenu />}
      </MobileRajainDrawer>
    </>
  );
};