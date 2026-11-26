import React, { useCallback, useMemo, useState } from 'react';

import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';

import { HAKU_RAJAIMET_ORDER } from './hakutulos/HAKU_RAJAIMET_ORDER';
import { MobileResultsPerPageExpansionMenu } from './hakutulos/MobileResultsPerPageExpansionMenu';
import { MobileToggleKoulutusOppilaitos } from './hakutulos/MobileToggleKoulutusOppilaitos';
import { MobileToggleOrderByButtonMenu } from './hakutulos/MobileToggleOrderByButtonMenu';
import { useAllSelectedFilters, useSearch } from './hakutulosHooks';

// etusivu: "Näytä tulokset" siirtyy hakusivulle, ja laatikossa valitaan koulutukset/oppilaitokset
// haku: hakusivulla tulokset ovat jo näkyvissä, ja laatikossa on järjestys ja sivukoko
export type MobileFiltersMode = 'etusivu' | 'haku';

export const MobileFiltersOnTopMenu = ({
  mode = 'haku',
  isButtonInline = false,
  buttonLabel,
  buttonTextColor = 'white',
}: {
  mode?: MobileFiltersMode;
  isButtonInline?: boolean;
  buttonLabel?: string;
  buttonTextColor?: string;
}) => {
  const { t } = useTranslation();

  const isEtusivuMode = mode === 'etusivu';

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
    if (isEtusivuMode) {
      goToSearchPage();
    }
    onToggleDrawer();
  }, [isEtusivuMode, goToSearchPage, onToggleDrawer]);

  return (
    <>
      {!isDrawerOpen && (
        <FilterSearchResultsButton
          inline={isButtonInline}
          textColor={buttonTextColor}
          selectedRajainCount={rajainCount}
          onClick={onToggleDrawer}>
          {buttonLabel ?? (isEtusivuMode ? t('haku.rajaa') : t('haku.rajaa-tuloksia'))}
        </FilterSearchResultsButton>
      )}
      <MobileRajainDrawer
        isOpen={isDrawerOpen}
        toggleOpen={onToggleDrawer}
        showResults={onShowResults}
        clearRajainValues={clearRajainValues}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        {isEtusivuMode && (
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
        {!isEtusivuMode && (
          <>
            <MobileToggleOrderByButtonMenu />
            <MobileResultsPerPageExpansionMenu />
          </>
        )}
      </MobileRajainDrawer>
    </>
  );
};
