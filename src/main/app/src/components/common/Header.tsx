import { useEffect, useRef } from 'react';

import { AppBar, Box, Chip, IconButton, Toolbar, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import OPOLogoEN from '#/src/assets/images/opintopolku_logo_header_en.svg?react';
import OPOLogoFI from '#/src/assets/images/opintopolku_logo_header_fi.svg?react';
import OPOLogoSV from '#/src/assets/images/opintopolku_logo_header_sv.svg?react';
import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { SideMenu } from '#/src/components/common/SideMenu';
import { styled, theme } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';

import { LanguageAccordion } from './LanguageAccordion';
import { SmartLink } from './SmartLink';
import { useSuosikitLink } from '../../hooks/useSuosikitLink';

const PREFIX = 'Header';

const classes = {
  testi: `${PREFIX}-testi`,
  menuButton: `${PREFIX}-menuButton`,
  menuBox: `${PREFIX}-menuBox`,
  menuText: `${PREFIX}-menuText`,
  toolBar: `${PREFIX}-ToolBar`,
};

const StyledAppBar = styled(AppBar)(() => ({
  height: theme.headerHeight,
  fontSize: 'small',
  [`& .${classes.toolBar}`]: {
    padding: '0.3rem 0.7rem 0.3rem 1.5rem',
    justifyContent: 'space-between',
  },

  [`& .${classes.testi}`]: {
    color: colors.white,
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    borderRadius: 2,
    marginLeft: '20px',
    background: colors.red,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
    borderRadius: 0,
    padding: '0.25rem',
  },
  [`& .${classes.menuButton}:focus`]: {
    outline: '1px solid rgb(255, 255, 255)',
  },

  [`& .${classes.menuBox}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 'none',
  },

  [`& .${classes.menuText}`]: {
    fontSize: 'small',
    color: colors.white,
  },
}));

const getOpintopolkuHeaderLogo = () => {
  switch (getLanguage()) {
    case 'fi':
      return OPOLogoFI;
    case 'en':
      return OPOLogoEN;
    case 'sv':
      return OPOLogoSV;
    default:
      return OPOLogoFI;
  }
};

const getTestiLabel = () => {
  const hostname = window.location.hostname;
  const environment = hostname.split('opintopolku.fi')?.[0];

  if (hostname === 'localhost') {
    return 'local';
  } else if (environment.length > 0) {
    return environment;
  }
};

const ToolbarLinkStyled = styled(SmartLink)({
  padding: '5px 5px 0 5px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1px',
  color: colors.white,
  textDecoration: 'none',
  flexShrink: 0,
  '& svg': {
    fontSize: '26px',
  },
  '&:focus-visible': {
    outline: `1px solid ${colors.white}`,
  },
});

const ToolbarLink = ({
  startIcon,
  children,
  ...rest
}: React.ComponentProps<typeof ToolbarLinkStyled> & { startIcon?: React.ReactNode }) => (
  <ToolbarLinkStyled {...rest}>
    {startIcon}
    {children}
  </ToolbarLinkStyled>
);

export const Header = ({
  toggleMenu,
  isOpen,
  refreshSideMenu,
  isSmall,
  menuVisible,
  closeMenu,
  sideMenuKey,
}: {
  toggleMenu: () => void;
  isOpen: boolean;
  refreshSideMenu: () => void;
  isSmall: boolean;
  menuVisible: boolean;
  closeMenu: () => void;
  sideMenuKey: number;
}) => {
  const { t } = useTranslation();
  const suosikitLink = useSuosikitLink();

  const testiLabel = getTestiLabel();
  const showTestiLabel = testiLabel != null;

  const OpintopolkuHeaderLogo = getOpintopolkuHeaderLogo();
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [searchRef, isOpen]);

  return (
    <StyledAppBar sx={{ position: { xs: 'absolute', sm: 'fixed' } }}>
      <Toolbar className={classes.toolBar}>
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label={t('avaa-sulje-valikko')}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls="side-menu"
            onClick={toggleMenu}
            edge="start"
            className={classes.menuButton}>
            <Box className={classes.menuBox}>
              {isOpen ? <MaterialIcon icon="close" /> : <MaterialIcon icon="menu" />}
              <Typography className={classes.menuText}>{t('valikko')}</Typography>
            </Box>
          </IconButton>
          <Box sx={{ position: 'absolute' }}>
            <SideMenu
              key={`sidemenu-key-${sideMenuKey}`}
              isSmall={isSmall}
              menuVisible={menuVisible}
              closeMenu={closeMenu}
              searchRef={searchRef}
            />
          </Box>
          <Link
            sx={{
              '&.Mui-focusVisible': {
                outline: '1px solid white',
                outlineOffset: '8px',
              },
            }}
            href="/"
            title={t('header.siirry-etusivulle')}
            onClick={refreshSideMenu}>
            <OpintopolkuHeaderLogo focusable="false" aria-hidden="true" height="26px" />
          </Link>
          {showTestiLabel && (
            <Chip className={classes.testi} size="small" label={testiLabel} />
          )}
        </Box>
        <Box
          display="flex"
          columnGap={2}
          marginRight="170px"
          sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {suosikitLink && <ToolbarLink {...suosikitLink} />}
          <ToolbarLink
            href={urls.url('oma-opintopolku')}
            target="_blank"
            startIcon={<MaterialIcon icon="apps" />}>
            {t('oma-opintopolku')}
          </ToolbarLink>
        </Box>
        <LanguageAccordion />
      </Toolbar>
    </StyledAppBar>
  );
};
