import React from 'react';

import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { ReactComponent as OPOLogoEN } from '#/src/assets/images/opintopolku_logo_header_en.svg';
import { ReactComponent as OPOLogoFI } from '#/src/assets/images/opintopolku_logo_header_fi.svg';
import { ReactComponent as OPOLogoSV } from '#/src/assets/images/opintopolku_logo_header_sv.svg';
import { colors } from '#/src/colors';
import BetaBanner from '#/src/components/common/BetaBanner';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { theme } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';

import { LanguageDropDown } from './LanguageDropDown';

const PREFIX = 'Header';

const classes = {
  testiLabel: `${PREFIX}-testiLabel`,
  testi: `${PREFIX}-testi`,
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  menuBox: `${PREFIX}-menuBox`,
  menuText: `${PREFIX}-menuText`,
  languageSelector: `${PREFIX}-languageSelector`,
  omaOpintopolkuLink: `${PREFIX}-omaOpintopolkuLink`,
  omaOpintopolkuIcon: `${PREFIX}-omaOpintopolkuIcon`,
  omaOpintopolkuText: `${PREFIX}-omaOpintopolkuText`,
  toolBar: `${PREFIX}-ToolBar`,
};

const StyledAppBar = styled(AppBar)(() => ({
  position: 'fixed',
  height: theme.headerHeight,
  [`& .${classes.testiLabel}`]: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.toolBar}`]: {
    padding: '0.3rem 1.5rem',
  },

  [`& .${classes.testi}`]: {
    color: colors.white,
    borderRadius: 2,
    marginLeft: 20,
    padding: '0px 5px',
    background: colors.red,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
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

  [`& .${classes.languageSelector}`]: {
    marginLeft: 'auto',
    float: 'left',
  },

  [`& .${classes.omaOpintopolkuLink}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0px 40px 0px 0px',
  },

  [`& .${classes.omaOpintopolkuIcon}`]: {
    color: colors.white,
  },

  [`& .${classes.omaOpintopolkuText}`]: {
    color: colors.white,
    fontSize: 'small',
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

const TESTI_LABELS = {
  'untuvaopintopolku.fi': 'untuva',
  'hahtuvaopintopolku.fi': 'hahtuva',
  'testiopintopolku.fi': 'testi',
};

export const Header = ({
  toggleMenu,
  isOpen,
  betaBanner,
  setBetaBanner,
  refreshSideMenu,
}) => {
  const { t } = useTranslation();

  const testiLabel = TESTI_LABELS[window.location.hostname];
  const showTestiLabel = testiLabel != null;

  const OpintopolkuHeaderLogo = getOpintopolkuHeaderLogo();

  return (
    <>
      <CssBaseline />
      <StyledAppBar className={classes.appBar}>
        {betaBanner ? <BetaBanner onClose={() => setBetaBanner(false)} /> : null}
        <Toolbar className={classes.toolBar}>
          <IconButton
            color="inherit"
            aria-label={t('avaa-sulje-valikko')}
            onClick={toggleMenu}
            edge="start"
            className={classes.menuButton}>
            <Box className={classes.menuBox}>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
              <Typography className={classes.menuText}>{t('valikko')}</Typography>
            </Box>
          </IconButton>
          <LocalizedLink
            component={RouterLink}
            to="/"
            title={t('header.siirry-etusivulle')}
            onClick={refreshSideMenu}>
            <OpintopolkuHeaderLogo focusable="false" aria-hidden="true" height="26px" />
          </LocalizedLink>
          {showTestiLabel && (
            <Chip
              className={classes.testi}
              size="small"
              classes={{ label: classes.testiLabel }}
              label={testiLabel}
            />
          )}
          <Hidden smDown>
            <Box display="flex" className={classes.languageSelector}>
              <Link
                href={urls.url('oma-opintopolku')}
                className={classes.omaOpintopolkuLink}
                target="_blank">
                <AppsIcon className={classes.omaOpintopolkuIcon} />
                <Typography className={classes.omaOpintopolkuText}>
                  {t('oma-opintopolku')}
                </Typography>
              </Link>
              <LanguageDropDown />
            </Box>
          </Hidden>
        </Toolbar>
      </StyledAppBar>
    </>
  );
};
