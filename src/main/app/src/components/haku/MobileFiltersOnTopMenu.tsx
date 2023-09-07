import React, { useCallback, useMemo, useState } from 'react';

import { Divider } from '@mui/material';
import { t } from 'i18next';

import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import { TyoelamaJaTaydennyskoulutuksetSuodatin } from '#/src/components/suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { FILTER_TYPES } from '#/src/constants';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { MobileResultsPerPageExpansionMenu } from './hakutulos/MobileResultsPerPageExpansionMenu';
import { MobileToggleKoulutusOppilaitos } from './hakutulos/MobileToggleKoulutusOppilaitos';
import { MobileToggleOrderByButtonMenu } from './hakutulos/MobileToggleOrderByButtonMenu';
import { useAllSelectedFilters, useFilterProps, useSearch } from './hakutulosHooks';
import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { HakuKaynnissaSuodatin } from '../suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '../suodattimet/common/HakutapaSuodatin';
import { KoulutuksenKestoSuodatin } from '../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '../suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '../suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '../suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';

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
    rajainOptions,
    rajainValues,
  } = useSearch();

  const hitCount = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusData?.total : oppilaitosData?.total),
    [selectedTab, koulutusData, oppilaitosData]
  );

  const { flat: allSelectedFilters } = useAllSelectedFilters();
  const rajainCount = allSelectedFilters?.length ?? 0;

  const [showFilters, setShowFilters] = useState(false);
  const onToggleShowFilters = useCallback(() => setShowFilters((s) => !s), []);

  const onShowResults = useCallback(() => {
    if (isAtEtusivu) {
      goToSearchPage();
    }
    onToggleShowFilters();
  }, [isAtEtusivu, goToSearchPage, onToggleShowFilters]);

  return (
    <>
      {!showFilters && (
        <FilterSearchResultsButton
          inline={isButtonInline}
          textColor="white"
          chosenFilterCount={rajainCount}
          onClick={onToggleShowFilters}>
          {isAtEtusivu ? t('haku.rajaa') : t('haku.rajaa-tuloksia')}
        </FilterSearchResultsButton>
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
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <OpetuskieliSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <OpetusaikaSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <SijaintiSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <PohjakoulutusvaatimusSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <HakuKaynnissaSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <TyoelamaJaTaydennyskoulutuksetSuodatin
          expanded={false}
          displaySelected
          rajainOptions={rajainOptions}
          rajainUIValues={rajainValues as any}
          setFilters={setFilters}
        />
        <Divider />
        <HakutapaSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.HAKUTAPA)}
          setFilters={setFilters}
        />
        <Divider />
        <ValintatapaSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.VALINTATAPA)}
          setFilters={setFilters}
        />
        <Divider />
        <KoulutusalaSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
          setFilters={setFilters}
        />
        <Divider />
        <OpetustapaSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
          setFilters={setFilters}
        />
        <Divider />
        <KoulutuksenKestoSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.KOULUTUKSENKESTOKUUKAUSINA)}
          setFilters={setFilters}
        />
        <Divider />
        <AlkamiskausiSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.ALKAMISKAUSI)}
          setFilters={setFilters}
        />
        <Divider />
        <MaksullisuusSuodatin
          expanded={false}
          displaySelected
          rajainValues={useFilterProps(FILTER_TYPES.MAKSULLISUUS)}
          setFilters={setFilters}
        />
        <Divider />
        {!isAtEtusivu && <MobileToggleOrderByButtonMenu />}
        {!isAtEtusivu && <MobileResultsPerPageExpansionMenu />}
      </MobileRajainDrawer>
    </>
  );
};
