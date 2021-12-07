import React from 'react';

import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Hidden,
  Icon,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import AppsIcon from '@material-ui/icons/Apps';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
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

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  testiLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  icon: {
    width: '160px',
    height: '100%',
    cursor: 'pointer',
  },
  testi: {
    color: colors.white,
    borderRadius: 2,
    marginLeft: 20,
    padding: '0px 5px',
    background: colors.red,
  },
  appBar: {
    position: 'fixed',
    height: 'auto',
    zIndex: theme.zIndex.drawer + 1,
  },
  iconButton: {
    padding: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 'none',
  },
  menuText: {
    fontSize: 'small',
    color: colors.white,
  },
  languageSelector: {
    marginLeft: 'auto',
    float: 'left',
  },
  omaOpintopolkuLink: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0px 40px 0px 0px',
  },
  omaOpintopolkuIcon: {
    color: colors.white,
  },
  omaOpintopolkuText: {
    color: colors.white,
    fontSize: 'small',
  },
}));

export const Header = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { toggleMenu, isOpen, betaBanner, setBetaBanner } = props;

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
    <React.Fragment>
      <CssBaseline />
      <AppBar className={clsx([classes.appBar, betaBanner ? classes.betaBanner : null])}>
        {betaBanner ? <BetaBanner onClose={() => setBetaBanner(false)} /> : null}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMenu}
            edge="start"
            className={classes.menuButton}>
            <Box className={classes.menuBox}>
              {isOpen ? <Icon>close</Icon> : <MenuIcon />}
              <Typography className={classes.menuText}>{t('valikko')}</Typography>
            </Box>
          </IconButton>
          <LocalizedLink component={RouterLink} to={`/`}>
            <Icon className={classes.icon}>
              <img alt={t('opintopolku.brand')} src={OpintopolkuHeaderLogo()} />
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
          <Hidden xsDown>
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
      </AppBar>
    </React.Fragment>
  );
};
