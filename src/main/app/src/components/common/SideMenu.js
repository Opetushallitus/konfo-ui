import React, { useState } from 'react';

import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Drawer,
  Paper,
  InputBase,
  Button,
  Box,
  Hidden,
  Typography,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import LanguageTab from '#/src/components/common/LanguageTab';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import SidebarValikko from '#/src/components/common/SidebarValikko';
import { SIDEMENU_WIDTH } from '#/src/constants';
import { useContentful } from '#/src/hooks/useContentful';
import { getHeaderHeight } from '#/src/theme';

const PREFIX = 'SideMenu';

const classes = {
  drawer: `${PREFIX}Drawer`,
  drawerPaper: `${PREFIX}DrawerPaper`,
  inputBackground: `${PREFIX}InputBackground`,
  murupolku: `${PREFIX}Murupolku`,
  inputRoot: `${PREFIX}InputRoot`,
  input: `${PREFIX}Input`,
  iconButton: `${PREFIX}IconButton`,
  divider: `${PREFIX}Divider`,
  drawerHeader: `${PREFIX}DrawerHeader`,
  omaOpintopolkuLink: `${PREFIX}OmaOpintopolkuLink`,
  omaOpintopolkuIcon: `${PREFIX}OmaOpintopolkuIcon`,
  omaOpintopolkuText: `${PREFIX}OmaOpintopolkuText`,
};

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['isSmall', 'betaBannerVisible'].includes(prop),
})(({ theme, isSmall, betaBannerVisible }) => ({
  width: isSmall ? '100%' : SIDEMENU_WIDTH,
  flexShrink: 0,

  [`& .${classes.drawerPaper}`]: {
    marginTop: getHeaderHeight(theme)({ betaBannerVisible, isSmall }),
    height: `calc(100% - ${getHeaderHeight(theme)({ betaBannerVisible, isSmall })}px)`,
    width: isSmall ? '100%' : SIDEMENU_WIDTH,
  },

  [`& .${classes.inputBackground}`]: {
    backgroundColor: colors.white,
    paddingLeft: '20px',
    paddingTop: '20px',
    paddingBottom: '20px',
  },

  [`& .${classes.murupolku}`]: {
    paddingLeft: '20px',
    paddingTop: '20px',
    paddingBottom: '20px',
  },

  [`& .${classes.inputRoot}`]: {
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
    width: 290,
  },

  [`& .${classes.input}`]: {
    borderRadius: 0,
    marginLeft: theme.spacing(1),
    flex: 1,
  },

  [`& .${classes.iconButton}`]: {
    minWidth: '40px',
    maxWidth: '40px',
    borderRadius: 0,
  },

  [`& .${classes.divider}`]: {
    height: 28,
    margin: 4,
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },

  [`& .${classes.omaOpintopolkuLink}`]: {
    display: 'flex',
    alignItems: 'left',
    flexDirection: 'row',
    margin: '20px 0px 0px 0px',
  },

  [`& .${classes.omaOpintopolkuIcon}`]: {
    color: colors.brandGreen,
    marginRight: 10,
  },

  [`& .${classes.omaOpintopolkuText}`]: {
    color: colors.brandGreen,
    fontSize: 'inherit',
  },
}));

export const SideMenu = (props) => {
  const { menuVisible, closeMenu } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data } = useContentful();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const { valikot, valikko, isLoading } = data;
  const selectValikko = (newValikko) => setSelected([...selected, newValikko]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const last = (a) => (a ? a[a.length - 1] : null);
  const single = (entry) => Object.values(entry || {})[0] || {};
  const selectedValikko = last(selected) ? (valikko || {})[last(selected)] : null;
  const linkit = selectedValikko
    ? [selectedValikko]
    : (single(valikot).valikot || []).map((v) => valikko[v.id]);

  const doSearch = (event) => {
    navigate(`/${i18n.language}/sisaltohaku/?hakusana=${search}`);
    event.preventDefault();
  };

  return (
    <StyledDrawer
      open={menuVisible}
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper,
      }}
      isSmall={props.isSmall}
      betaBannerVisible={props.betaBannerVisible}>
      <div className={classes.inputBackground}>
        <Hidden smUp>
          <Box mb={2}>
            <LanguageTab />
            <Link
              href={urls.url('oma-opintopolku')}
              className={classes.omaOpintopolkuLink}
              target="_blank">
              <AppsOutlinedIcon className={classes.omaOpintopolkuIcon} />
              <Typography className={classes.omaOpintopolkuText}>
                {t('oma-opintopolku')}
              </Typography>
            </Link>
          </Box>
        </Hidden>
        <Paper
          component="form"
          onSubmit={doSearch}
          className={classes.inputRoot}
          elevation={0}>
          <InputBase
            className={classes.input}
            value={search}
            onKeyPress={(event) => event.key === 'Enter' && doSearch(event)}
            onChange={({ target }) => setSearch(target.value)}
            placeholder={t('sidebar.etsi-tietoa-opintopolusta')}
            inputProps={{
              'aria-label': t('sidebar.etsi-tietoa-opintopolusta'),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.iconButton}
            aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
            <SearchIcon />
          </Button>
        </Paper>
      </div>
      {selectedValikko ? null : (
        <div className={classes.murupolku}>
          <Murupolku path={[]} />
        </div>
      )}
      {isLoading ? (
        <LoadingCircle />
      ) : (
        linkit.map((linkkiValikko) => {
          const id = linkkiValikko.id;
          const links = linkkiValikko.linkki || [];

          return (
            <SidebarValikko
              key={id}
              id={id}
              parent={selectedValikko}
              name={linkkiValikko.name}
              deselect={popSelected}
              select={selectValikko}
              links={links}
              closeMenu={closeMenu}
            />
          );
        })
      )}
    </StyledDrawer>
  );
};
