// Uuden etusivun rajaa-painike ja rajainvalinnat. Isoilla näytöillä rajaimet avautuvat popoveriin
// (kuten nykyisellä etusivulla), pienillä näytöillä alhaalta avautuvaan laatikkoon (drawer).
import React, { useCallback, useMemo } from 'react';

import { Badge, Box, Button, CircularProgress, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import { HAKU_RAJAIMET_ORDER } from '#/src/components/haku/hakutulos/HAKU_RAJAIMET_ORDER';
import { MobileToggleKoulutusOppilaitos } from '#/src/components/haku/hakutulos/MobileToggleKoulutusOppilaitos';
import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { useMediaQuery, useTheme } from '@mui/system';
import { match, P } from 'ts-pattern';

export const RAJAIMET_POPOVER_ID = 'filters-popover';

// Rajaa-painike hakukentän sisällä oikealla. Näkyy kaikilla näytöillä, ja badge näyttää valittujen
// rajainten määrän. Matala, jotta se ei kasvata hakukentän korkeutta.
export const RajaaButton = ({
  isOpen,
  isLoading,
  selectedCount,
  onClick,
}: {
  isOpen: boolean;
  isLoading: boolean;
  selectedCount: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const endIcon = match([isLoading, isSmallScreen])
    .with([true, P.any], () => <CircularProgress size={20} color="inherit" />)
    .with([P.any, true], () => (
      <Badge badgeContent={selectedCount} showZero={false} color="error">
        <MaterialIcon icon="filter_list" />
      </Badge>
    ))
    .with([P.any, false], () => (
      <>
        {selectedCount > 0 && (
          <Badge
            badgeContent={selectedCount}
            color="error"
            // Ilman lapsielementtiä: badge normaalissa virrassa kuvakkeen tavoin (ei kulmassa)
            sx={{
              alignItems: 'center',
              '& .MuiBadge-badge': {
                position: 'static',
                transform: 'none',
                marginRight: '2px',
              },
            }}
          />
        )}
        <MaterialIcon icon="expand_more" />
      </>
    ))
    .otherwise(() => null);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!isSmallScreen && <Divider orientation="vertical" flexItem />}
      <Button
        aria-describedby={RAJAIMET_POPOVER_ID}
        aria-expanded={isOpen}
        onClick={onClick}
        endIcon={endIcon}
        sx={{
          fontWeight: 600,
          whiteSpace: 'nowrap',
          // Normaalikokoinen painike, mutta ilman pystysuuntaista paddingia ja marginaalia, jotta
          // se ei kasvata hakukentän korkeutta
          paddingY: 0,
          marginY: 0,
        }}>
        {t('opintopolku-etusivu.rajaa-etsimaasi')}
      </Button>
    </Box>
  );
};

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
