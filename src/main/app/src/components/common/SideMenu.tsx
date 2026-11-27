import React, { Fragment, useEffect, useRef, useState } from 'react';

import {
  Drawer,
  drawerClasses,
  InputBase,
  inputBaseClasses,
  Box,
  Stack,
} from '@mui/material';
import { OphButton, ophColors } from '@opetushallitus/oph-design-system';
import { includes, last } from 'lodash-es';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { EtusivuLink } from '#/src/components/common/EtusivuLink';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { MobileLanguageSelection } from '#/src/components/common/MobileLanguageSelection';
import { OphThemeRoute } from '#/src/components/common/OphThemeRoute';
import { SidebarTakaisin, SidebarValikko } from '#/src/components/common/SidebarValikko';
import { SIDEMENU_WIDTH } from '#/src/constants';
import { useContentful } from '#/src/hooks/useContentful';
import { getHeaderHeight, styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';
import { ContentfulLink, ContentfulValikko } from '#/src/types/ContentfulTypes';

import { TextButtonLink } from './TextButtonLink';
import { useSuosikitLink } from '../../hooks/useSuosikitLink';

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !includes(['isMenuOverlay'], prop),
})<{ isMenuOverlay: boolean }>(({ theme, isMenuOverlay }) => ({
  ...(isMenuOverlay
    ? {
        // Temporary-tilassa juuri on koko näytön Modal. Pidetään header sen yläpuolella,
        // jotta headerin painikkeet toimivat valikon ollessa auki.
        zIndex: theme.zIndex.appBar - 1,
        '& .MuiBackdrop-root': {
          top: getHeaderHeight(theme),
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      }
    : {
        width: SIDEMENU_WIDTH,
        flexShrink: 0,
      }),

  [`& .${drawerClasses.paper}`]: {
    padding: theme.spacing(2, 1.5, 4, 1.5),
    marginTop: getHeaderHeight(theme),
    height: `calc(100% - ${getHeaderHeight(theme)}px)`,
    width: isMenuOverlay ? '100%' : SIDEMENU_WIDTH,
    maxWidth: SIDEMENU_WIDTH,
  },
}));

const SearchForm = styled('form')(({ theme }) => ({
  width: `calc(100% - ${theme.spacing(1.5)})`,
}));

const SEARCH_INPUT_RADIUS = '4px';

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  height: '42px',
  boxSizing: 'border-box',
  border: '1px solid',
  borderColor: ophColors.grey400,
  borderRadius: SEARCH_INPUT_RADIUS,
  [`& .${inputBaseClasses.input}`]: {
    paddingLeft: theme.spacing(1),
  },
}));

const withoutLanguagePrefix = (pathname: string) =>
  pathname.replace(/^\/(fi|sv|en)(?=\/|$)/, '');

const SEARCH_INPUT_ID = 'side-menu-search-input';

// Valikon osio: otsikko (alivalikon nimi) ja sen alla näytettävät linkit
type Osio = {
  id: string;
  name: string;
  links: Array<ContentfulLink>;
};

const toOsio = (v: ContentfulValikko): Osio => ({
  id: v.id,
  name: v.name,
  links: v.linkki ?? [],
});

export const SideMenu = (props: {
  menuVisible?: boolean;
  isMenuOverlay: boolean;
  closeMenu: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const { menuVisible, isMenuOverlay, closeMenu, searchRef } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const suosikitLink = useSuosikitLink();
  const { pathname } = useLocation();

  // Sisällön päällä oleva valikko suljetaan, kun jotain valitaan. Sivua siirtävä valikko jää auki.
  const closeOverlayMenu = () => {
    if (isMenuOverlay) {
      closeMenu();
    }
  };

  // Suljetaan päällä oleva valikko sivun vaihtuessa (esim. murupolun kautta). Pelkkä kielen
  // vaihto (/fi/... -> /sv/...) ei ole sivunvaihto, joten valikko jää silloin auki.
  const pathWithoutLanguage = withoutLanguagePrefix(pathname);
  const previousPathRef = useRef(pathWithoutLanguage);
  useEffect(() => {
    if (previousPathRef.current !== pathWithoutLanguage) {
      previousPathRef.current = pathWithoutLanguage;
      if (isMenuOverlay) {
        closeMenu();
      }
    }
  }, [pathWithoutLanguage, isMenuOverlay, closeMenu]);

  const { data, isLoading } = useContentful();
  const [selected, setSelected] = useState<Array<string>>([]);
  const [search, setSearch] = useState('');

  const { paavalikko, valikko } = data;
  const selectValikko = (newValikkoId: string) =>
    setSelected([...selected, newValikkoId]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const lastSelected = last(selected);
  const selectedValikko = lastSelected ? valikko?.[lastSelected] : undefined;

  // Jos avatun valikon kaikki kohdat ovat alivalikoita, näytetään alivalikot omina
  // otsikoituina osioinaan. Muuten kohdat näytetään avatun valikon otsikon alla.
  const toOsiot = (avattu: ContentfulValikko): Array<Osio> => {
    const alivalikot = (avattu.linkki ?? []).map((link) =>
      link.type === 'valikko' ? valikko[link.id] : undefined
    );
    return alivalikot.length > 0 && alivalikot.every(Boolean)
      ? (alivalikot as Array<ContentfulValikko>).map(toOsio)
      : [toOsio(avattu)];
  };

  const osiot: Array<Osio> = selectedValikko
    ? toOsiot(selectedValikko)
    : (getOne(paavalikko)?.valikot ?? [])
        .map((v) => valikko[v.id])
        .filter(Boolean)
        .map(toOsio);

  const doSearch = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isMenuOverlay) {
      closeMenu();
    }
    navigate(`/${i18n.language}/sisaltohaku/?hakusana=${encodeURIComponent(search)}`);
  };

  return (
    <OphThemeRoute>
      <StyledDrawer
        id="side-menu"
        open={menuVisible}
        // Pienillä näytöillä valikko on sisällön päällä (temporary): Modal tuo taustan,
        // vierityksen eston, fokuksen hallinnan ja Esc-sulkemisen. Muuten valikko siirtää sisältöä.
        variant={isMenuOverlay ? 'temporary' : 'persistent'}
        onClose={closeMenu}
        ModalProps={{
          keepMounted: true,
          // Header fokusoi hakukentän valikon avautuessa
          disableAutoFocus: true,
        }}
        anchor="left"
        isMenuOverlay={isMenuOverlay}>
        <Stack gap={3}>
          <SearchForm onSubmit={doSearch} role="search">
            <Box
              component="label"
              htmlFor={SEARCH_INPUT_ID}
              sx={{ display: 'block', fontSize: '18px', marginBottom: 1 }}>
              {t('sidebar.etsi-tietoa-opintopolusta')}:
            </Box>
            <SearchInput
              id={SEARCH_INPUT_ID}
              value={search}
              inputRef={searchRef}
              onChange={({ target }) => setSearch(target.value)}
              endAdornment={
                <OphButton
                  type="submit"
                  variant="contained"
                  sx={{
                    alignSelf: 'stretch',
                    minWidth: '40px',
                    maxWidth: '40px',
                    // Nappi peittää inputin reunaviivan oikealta, ylhäältä ja alhaalta
                    margin: '-1px -1px -1px 0',
                    borderRadius: `0 ${SEARCH_INPUT_RADIUS} ${SEARCH_INPUT_RADIUS} 0`,
                  }}
                  aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
                  <MaterialIcon icon="search" />
                </OphButton>
              }
            />
          </SearchForm>

          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.5,
            }}>
            <EtusivuLink onClick={closeOverlayMenu} />
            {suosikitLink && (
              <TextButtonLink {...suosikitLink} onClick={closeOverlayMenu} />
            )}
            <TextButtonLink
              href={urls.url('oma-opintopolku')}
              target="_blank"
              startIcon={<MaterialIcon icon="apps" />}>
              {t('oma-opintopolku')}
            </TextButtonLink>
          </Box>

          <MobileLanguageSelection />
        </Stack>
        <Box>
          {isLoading ? (
            <LoadingCircle />
          ) : (
            <>
              {selectedValikko && (
                <SidebarTakaisin valikko={selectedValikko} deselect={popSelected} />
              )}
              {osiot.map((osio, index) => (
                <Fragment key={osio.id}>
                  <SidebarValikko
                    name={osio.name}
                    select={selectValikko}
                    links={osio.links}
                    closeMenu={closeOverlayMenu}
                  />
                  {/* Tutkintojen tunnustaminen näytetään toisena olevan ("Hae koulutukseen") valikon jälkeen */}
                  {!selectedValikko && index === 1 && (
                    <SidebarValikko
                      name={t('tutu.tutu')}
                      select={selectValikko}
                      links={[]}
                      internalLinks={[
                        {
                          name: t('tutu.tutu-opas.tutu-opas'),
                          href: '/tutkintojen-tunnustaminen/tutkintojen-tunnustamisen-palveluopas',
                        },
                      ]}
                      closeMenu={closeOverlayMenu}
                    />
                  )}
                </Fragment>
              ))}
            </>
          )}
        </Box>
      </StyledDrawer>
    </OphThemeRoute>
  );
};
