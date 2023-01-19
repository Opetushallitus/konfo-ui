import React, { Fragment } from 'react';

import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Hidden,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import OPOLogoEN from '#/src/assets/images/OPO_Logo_Header_englanti.svg';
import OPOLogoSV from '#/src/assets/images/OPO_Logo_Header_ruotsi.svg';
import OPOLogoFI from '#/src/assets/images/OPO_Logo_Header_suomi.svg';
import { colors } from '#/src/colors';
import BetaBanner from '#/src/components/common/BetaBanner';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { getLanguage } from '#/src/tools/localization';

import LanguageDropDown from './LanguageDropDown';

const PREFIX = 'Header';

const classes = {
  testiLabel: `${PREFIX}-testiLabel`,
  icon: `${PREFIX}-icon`,
  testi: `${PREFIX}-testi`,
  appBar: `${PREFIX}-appBar`,
  iconButton: `${PREFIX}-iconButton`,
  menuButton: `${PREFIX}-menuButton`,
  menuBox: `${PREFIX}-menuBox`,
  menuText: `${PREFIX}-menuText`,
  languageSelector: `${PREFIX}-languageSelector`,
  omaOpintopolkuLink: `${PREFIX}-omaOpintopolkuLink`,
  omaOpintopolkuIcon: `${PREFIX}-omaOpintopolkuIcon`,
  omaOpintopolkuText: `${PREFIX}-omaOpintopolkuText`,
  toolBar: `${PREFIX}-ToolBar`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: 'auto',
  zIndex: theme.zIndex.drawer + 1,

  [`& .${classes.testiLabel}`]: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.toolBar}`]: {
    padding: '0.3rem 1.5rem',
  },

  [`& .${classes.icon}`]: {
    width: '160px',
    height: '100%',
    cursor: 'pointer',
  },

  [`& .${classes.testi}`]: {
    color: colors.white,
    borderRadius: 2,
    marginLeft: 20,
    padding: '0px 5px',
    background: colors.red,
  },

  [`& .${classes.iconButton}`]: {
    padding: 10,
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

export const Header = (props) => {
  const { t } = useTranslation();

  const { toggleMenu, isOpen, betaBanner, setBetaBanner, refreshSideMenu } = props;

  setBetaBanner(false);

  const hostname = window.location.hostname;
  const testiLabels = {
    'untuvaopintopolku.fi': 'untuva',
    'hahtuvaopintopolku.fi': 'hahtuva',
    'testiopintopolku.fi': 'testi',
  };
  const testiLabel = testiLabels[hostname];
  const showTestiLabel = testiLabel != null;

  const OpintopolkuHeaderLogo = () => {
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

  return (
    <Fragment>
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
            <Icon className={classes.icon}>
              <img alt={t('header.siirry-etusivulle')} src={OpintopolkuHeaderLogo()} />
            </Icon>
          </LocalizedLink>
          {showTestiLabel ? (
            <Chip
              className={classes.testi}
              size="small"
              classes={{ label: classes.testiLabel }}
              label={testiLabel}
            />
          ) : null}
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
    </Fragment>
  );
};
