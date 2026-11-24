// Uuden etusivun rajaa-painike ja rajainvalinnat. Isoilla näytöillä rajaimet avautuvat popoveriin
// (kuten nykyisellä etusivulla), pienillä näytöillä alhaalta avautuvaan laatikkoon (drawer).
import React, { useCallback, useMemo } from 'react';

import { Divider } from '@mui/material';

import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import { HAKU_RAJAIMET_ORDER } from '#/src/components/haku/hakutulos/HAKU_RAJAIMET_ORDER';
import { MobileToggleKoulutusOppilaitos } from '#/src/components/haku/hakutulos/MobileToggleKoulutusOppilaitos';
import { useSearch } from '#/src/components/haku/hakutulosHooks';

export const RAJAIMET_POPOVER_ID = 'filters-popover';

// Pienten näyttöjen rajainvalinnat. Koottu samoista osista kuin MobileFiltersOnTopMenu etusivulla.
export const RajaimetDrawer = ({
  isOpen,
  toggleOpen,
  selectedCount,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
  selectedCount: number;
}) => {
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

  // "Näytä tulokset" siirtyy hakusivulle valituilla rajaimilla
  const onShowResults = useCallback(() => {
    goToSearchPage();
    toggleOpen();
  }, [goToSearchPage, toggleOpen]);

  return (
    <MobileRajainDrawer
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      showResults={onShowResults}
      clearRajainValues={clearRajainValues}
      rajainCount={selectedCount}
      resultCount={hitCount}>
      <MobileToggleKoulutusOppilaitos />
      <Divider />
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
    </MobileRajainDrawer>
  );
};
