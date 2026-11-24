import { useState } from 'react';

import { Box, useMediaQuery } from '@mui/material';
import { Stack, useTheme } from '@mui/system';
import { OphButton, OphInput, OphLink } from '@opetushallitus/oph-design-system';
import { isEmpty } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { SmartLink } from '#/src/components/common/SmartLink';
import { Hakupalkki } from '#/src/components/haku/Hakupalkki';
import { useAllSelectedFilters, useSearch } from '#/src/components/haku/hakutulosHooks';
import { MobileFiltersOnTopMenu } from '#/src/components/haku/MobileFiltersOnTopMenu';
import {
  RajaaPopoverButton,
  RajaimetPopover,
} from '#/src/components/haku/RajaimetPopover';
import { styled } from '#/src/theme';
import { PageSectionHeading } from '../PageSectionHeading';

// Hakukenttä oph-design-systemin oletustyyleillä. Rajaa-painike (ja kapeilla näytöillä
// hakupainike) on kentän sisällä Autocompleten tyhjennyspainikkeen jälkeen.
const EtusivuSearchInput = styled(OphInput)(({ theme }) => ({
  // Autocomplete lisää outlined-kentälle oman paddingin, varaa oikealle tilaa absoluuttisesti
  // sijoitetulle tyhjennyspainikkeelle ja rivittää sisällön (monivalintojen chipeille).
  // Palautetaan oph-design-systemin oletuspaddingit ja pidetään kaikki samalla rivillä.
  // &&&& ohittaa Autocompleten omat, tarkemmat säännöt.
  '&&&&': {
    padding: 0,
    paddingRight: theme.spacing(1),
    flexWrap: 'nowrap',
  },
  '&&&& .MuiAutocomplete-input': {
    padding: theme.spacing(1.5, 2),
  },
  // Tyhjennyspainike normaaliin virtaan, jotta järjestys on: teksti, tyhjennyspainike,
  // rajaa-painike
  '& .MuiAutocomplete-endAdornment': {
    position: 'static',
    transform: 'none',
  },
}));

// Kenttä ja hakupainike vierekkäin ilman Konfon hakulaatikkoa. stretch: hakupainike venyy
// hakukentän korkuiseksi.
const SEARCH_FORM_SX = {
  display: 'flex',
  width: '100%',
  alignItems: 'stretch',
  gap: 2,
  backgroundColor: 'transparent',
  boxShadow: 'none',
} as const;

// Hakupalkki rajaa-painikkeella ja linkki kaikkiin hakutuloksiin (kuten nykyisen etusivun Jumpotronissa)
export const EtusivuHaku = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Isoilla näytöillä rajaimet popoverissa, pienillä alhaalta avautuvassa laatikossa
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  // Popover poistuu pienellä näytöllä, joten suljetaan se, ettei se avaudu uudelleen isommalla
  if (isSmall && anchorEl) {
    setAnchorEl(null);
  }

  const { koulutusData, isFetching } = useSearch();
  const selectedCount = useAllSelectedFilters().flat.length;
  const hasFilters = !isEmpty(koulutusData?.filters);
  const showPopover = hasFilters && !isSmall;
  const showDrawer = hasFilters && isSmall;

  return (
    <Stack>
      {showPopover && <RajaimetPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />}
      <PageSectionHeading component="h2">
        {t('opintopolku-etusivu.hae-otsikko')}
      </PageSectionHeading>
      <Hakupalkki
        InputComponent={EtusivuSearchInput}
        sx={SEARCH_FORM_SX}
        // Isoilla näytöillä rajaa-painike hakukentän sisällä, pienillä linkin vieressä (alla).
        // Isoilla näytöillä Etsi-painike kentän vieressä, pienillä suurennuslasi kentän sisällä.
        inputEndAdornment={
          showPopover ? (
            <RajaaPopoverButton
              variant="oph"
              isPopoverOpen={Boolean(anchorEl)}
              isLoading={isFetching}
              selectedCount={selectedCount}
              setAnchorEl={setAnchorEl}
            />
          ) : null
        }
        searchButtonInInput={isSmall}
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
          <OphLink component={SmartLink} href="/haku">
            {t('opintopolku-etusivu.nayta-kaikki')}
          </OphLink>
        ) : (
          <OphButton component={SmartLink} href="/haku" variant="outlined">
            {t('opintopolku-etusivu.nayta-kaikki')}
          </OphButton>
        )}
        {showDrawer && (
          <MobileFiltersOnTopMenu
            mode="etusivu"
            isButtonInline
            buttonLabel={t('opintopolku-etusivu.rajaa-etsimaasi')}
            buttonTextColor="primary.main"
          />
        )}
      </Box>
    </Stack>
  );
};
