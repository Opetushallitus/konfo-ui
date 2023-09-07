import React, { useCallback, useMemo, useState } from 'react';

import { Divider } from '@mui/material';
import { t } from 'i18next';

import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { HAKU_RAJAIMET_ORDER } from './hakutulos/HAKU_RAJAIMET_ORDER';
import { MobileResultsPerPageExpansionMenu } from './hakutulos/MobileResultsPerPageExpansionMenu';
import { MobileToggleKoulutusOppilaitos } from './hakutulos/MobileToggleKoulutusOppilaitos';
import { MobileToggleOrderByButtonMenu } from './hakutulos/MobileToggleOrderByButtonMenu';
import { useAllSelectedFilters, useSearch } from './hakutulosHooks';

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
        {isAtEtusivu && (
          <>
            <MobileToggleKoulutusOppilaitos />
            <Divider />
          </>
        )}
        {HAKU_RAJAIMET_ORDER.map(({ Component }) => (
          <>
            <Component
              expanded={false}
              displaySelected
              rajainOptions={rajainOptions}
              rajainValues={rajainValues}
              setFilters={setFilters}
            />
            <Divider />
          </>
        ))}
        {!isAtEtusivu && (
          <>
            <MobileToggleOrderByButtonMenu />
            <MobileResultsPerPageExpansionMenu />
          </>
        )}
      </MobileRajainDrawer>
    </>
  );
};
