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
    clearRajainValues,
    goToSearchPage,
    setRajainValues,
    rajainOptions,
    rajainValues,
  } = useSearch();

  const hitCount = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusData?.total : oppilaitosData?.total),
    [selectedTab, koulutusData, oppilaitosData]
  );

  const { flat: allSelectedFilters } = useAllSelectedFilters();
  const rajainCount = allSelectedFilters?.length ?? 0;

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const onToggleDrawer = useCallback(() => setDrawerOpen((s) => !s), []);

  const onShowResults = useCallback(() => {
    if (isAtEtusivu) {
      goToSearchPage();
    }
    onToggleDrawer();
  }, [isAtEtusivu, goToSearchPage, onToggleDrawer]);

  return (
    <>
      {!isDrawerOpen && (
        <FilterSearchResultsButton
          inline={isButtonInline}
          textColor="white"
          selectedRajainCount={rajainCount}
          onClick={onToggleDrawer}>
          {isAtEtusivu ? t('haku.rajaa') : t('haku.rajaa-tuloksia')}
        </FilterSearchResultsButton>
      )}
      <MobileRajainDrawer
        isOpen={isDrawerOpen}
        toggleOpen={onToggleDrawer}
        showResults={onShowResults}
        clearRajainValues={clearRajainValues}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        {isAtEtusivu && (
          <>
            <MobileToggleKoulutusOppilaitos />
            <Divider />
          </>
        )}
        {HAKU_RAJAIMET_ORDER.map(({ id, Component }) => (
          <React.Fragment key={id}>
            <Component
              expanded={false}
              displaySelected
              rajainOptions={rajainOptions}
              rajainValues={rajainValues}
              setRajainValues={setRajainValues}
            />
            <Divider />
          </React.Fragment>
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
