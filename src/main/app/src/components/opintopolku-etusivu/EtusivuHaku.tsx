import { useCallback, useState } from 'react';

import { Box, useMediaQuery } from '@mui/material';
import { Stack, useTheme } from '@mui/system';
import { OphButton, OphLink } from '@opetushallitus/oph-design-system';
import { isEmpty } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Hakupalkki } from '#/src/components/haku/Hakupalkki';
import { useAllSelectedFilters, useSearch } from '#/src/components/haku/hakutulosHooks';
import { RajaimetPopover } from '#/src/components/haku/RajaimetPopover';
import { SectionHeading } from './opintopolkuEtusivuUtils';
import { RajaimetDrawer } from './RajaimetDrawer';
import { RajaaButton } from './RajaaButton';

// Hakupalkki rajaa-painikkeella ja linkki kaikkiin hakutuloksiin (kuten nykyisen etusivun Jumpotronissa)
export const EtusivuHaku = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), []);
  // Isoilla näytöillä rajaimet popoverissa, pienillä alhaalta avautuvassa laatikossa
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const { koulutusData, isFetching } = useSearch();
  const allSelectedFilters = useAllSelectedFilters();
  const selectedCount = allSelectedFilters?.flat?.length ?? 0;
  const hasFilters = !isEmpty(koulutusData?.filters);
  const showPopover = hasFilters && !isSmall;
  const showDrawer = hasFilters && isSmall;

  return (
    <Box>
      {showPopover && <RajaimetPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />}
      {showDrawer && (
        <RajaimetDrawer
          isOpen={isDrawerOpen}
          toggleOpen={toggleDrawer}
          selectedCount={selectedCount}
        />
      )}
      <Stack>
        <SectionHeading component="h2">
          {t('opintopolku-etusivu.hae-otsikko')}
        </SectionHeading>
        <Hakupalkki
          variant="oph"
          // Isoilla näytöillä rajaa-painike hakukentän sisällä, pienillä linkin vieressä (alla)
          rajaaButton={
            showPopover ? (
              <RajaaButton
                isOpen={isPopoverOpen}
                isLoading={isFetching}
                isSmall={false}
                selectedCount={selectedCount}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              />
            ) : null
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            marginTop: theme.spacing(1),
          }}>
          {isSmall ? (
            <OphLink component={RouterLink} to="/haku">
              {t('opintopolku-etusivu.nayta-kaikki')}
            </OphLink>
          ) : (
            <OphButton component={RouterLink} to="/haku" variant="outlined">
              {t('opintopolku-etusivu.nayta-kaikki')}
            </OphButton>
          )}
          {showDrawer && (
            <RajaaButton
              isOpen={isDrawerOpen}
              isLoading={isFetching}
              isSmall
              selectedCount={selectedCount}
              onClick={toggleDrawer}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
};
