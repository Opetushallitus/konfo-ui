import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Drawer, drawerClasses, InputBase, Button, Box } from '@mui/material';
import { includes, last } from 'lodash-es';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { EtusivuLink } from '#/src/components/common/EtusivuLink';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { MobileLanguageSelection } from '#/src/components/common/MobileLanguageSelection';
import { SidebarValikko } from '#/src/components/common/SidebarValikko';
import { SIDEMENU_WIDTH } from '#/src/constants';
import { useContentful } from '#/src/hooks/useContentful';
import { getHeaderHeight, styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

import { TextButtonLink } from './TextButtonLink';
import { useSuosikitLink } from '../../hooks/useSuosikitLink';
import { Stack } from '@mui/system';
import { colors } from '#/src/colors';

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
    paddingLeft: theme.spacing(1.5),
    paddingTop: theme.spacing(2),
    marginTop: getHeaderHeight(theme),
    height: `calc(100% - ${getHeaderHeight(theme)}px)`,
    width: isMenuOverlay ? '100%' : SIDEMENU_WIDTH,
    maxWidth: SIDEMENU_WIDTH,
  },
}));

const SearchForm = styled('form')(({ theme }) => ({
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  border: '1px solid',
  borderColor: colors.grey500,
  borderRadius: '2px',
  width: `calc(100% - ${theme.spacing(1.5)})`,
}));

const withoutLanguagePrefix = (pathname: string) =>
  pathname.replace(/^\/(fi|sv|en)(?=\/|$)/, '');

const SEARCH_INPUT_ID = 'side-menu-search-input';

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

  const { valikot, valikko } = data;
  const selectValikko = (newValikkoId: string) =>
    setSelected([...selected, newValikkoId]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const lastSelected = last(selected);
  const selectedValikko = lastSelected ? valikko?.[lastSelected] : undefined;
  const linkit = selectedValikko
    ? [selectedValikko]
    : (getOne(valikot)?.valikot ?? []).map((v) => valikko[v.id]);

  const doSearch = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isMenuOverlay) {
      closeMenu();
    }
    navigate(`/${i18n.language}/sisaltohaku/?hakusana=${search}`);
  };

  return (
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
        <Box>
          <label htmlFor={SEARCH_INPUT_ID}>
            {t('sidebar.etsi-tietoa-opintopolusta')}:
          </label>
          <SearchForm onSubmit={doSearch} role="search">
            <InputBase
              sx={{ flex: 1, borderRadius: 0, margin: 1 }}
              value={search}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  doSearch(event);
                }
              }}
              inputRef={searchRef}
              onChange={({ target }) => setSearch(target.value)}
              inputProps={{
                id: SEARCH_INPUT_ID,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: '40px', maxWidth: '40px', borderRadius: 0 }}
              aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
              <MaterialIcon icon="search" />
            </Button>
          </SearchForm>
        </Box>

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

        <Box>
          {isLoading ? (
            <LoadingCircle />
          ) : (
            linkit.map((linkkiValikko, index) => {
              const id = linkkiValikko.id;
              const links = linkkiValikko.linkki || [];

              return (
                <Fragment key={id}>
                  <SidebarValikko
                    parent={selectedValikko}
                    name={linkkiValikko.name}
                    deselect={popSelected}
                    select={selectValikko}
                    links={links}
                    closeMenu={closeOverlayMenu}
                  />
                  {/* Tutkintojen tunnustaminen näytetään toisena olevan ("Hae koulutukseen") valikon jälkeen */}
                  {!selectedValikko && index === 1 && (
                    <SidebarValikko
                      name={t('tutu.tutu')}
                      deselect={popSelected}
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
              );
            })
          )}
        </Box>
      </Stack>
    </StyledDrawer>
  );
};
