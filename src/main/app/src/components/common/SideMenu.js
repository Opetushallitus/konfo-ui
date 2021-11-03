import React, { useState } from 'react';

import {
  makeStyles,
  Drawer,
  Paper,
  InputBase,
  Button,
  Box,
  Hidden,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { colors } from '#/src/colors';
import LanguageTab from '#/src/components/common/LanguageTab';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import SidebarValikko from '#/src/components/common/SidebarValikko';
import { DRAWER_WIDTH } from '#/src/constants';
import { useContentful } from '#/src/hooks';
import { getHeaderHeight } from '#/src/theme';

const useStyles = makeStyles((theme) => ({
  drawer: ({ isSmall }) => ({
    width: isSmall ? '100%' : DRAWER_WIDTH,
    flexShrink: 0,
  }),
  drawerPaper: ({ betaBannerVisible, isSmall }) => ({
    marginTop: getHeaderHeight(theme)({ betaBannerVisible, isSmall }),
    height: `calc(100% - ${getHeaderHeight(theme)({ betaBannerVisible, isSmall })}px)`,
    width: isSmall ? '100%' : DRAWER_WIDTH,
  }),
  inputBackground: {
    backgroundColor: colors.white,
    paddingLeft: '20px',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  murupolku: {
    paddingLeft: '20px',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  inputRoot: {
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
    width: 290,
  },
  input: {
    borderRadius: 0,
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    minWidth: '40px',
    maxWidth: '40px',
    borderRadius: 0,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

export const SideMenu = (props) => {
  const { menuVisible, closeMenu } = props;
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const classes = useStyles(props);
  const { data } = useContentful();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const { valikot, valikko, loading } = data;
  const selectValikko = (valikko) => setSelected([...selected, valikko]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const last = (a) => (a ? a[a.length - 1] : null);
  const single = (entry) => Object.values(entry || {})[0] || {};
  const selectedValikko = last(selected) ? (valikko || {})[last(selected)] : null;
  const linkit = selectedValikko
    ? [selectedValikko]
    : (single(valikot).valikot || []).map((v) => valikko[v.id]);

  const doSearch = (event) => {
    history.push(`/${i18n.language}/sisaltohaku/?hakusana=${search}`);
    event.preventDefault();
  };

  return (
    <Drawer
      open={menuVisible}
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper,
      }}>
      <div className={classes.inputBackground}>
        <Hidden smUp>
          <Box mb={2}>
            <LanguageTab />
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
      {loading ? (
        <LoadingCircle />
      ) : (
        linkit.map((valikko) => {
          const id = valikko.id;
          const links = valikko.linkki || [];

          return (
            <SidebarValikko
              key={id}
              id={id}
              parent={selectedValikko}
              name={valikko.name}
              deselect={popSelected}
              select={selectValikko}
              links={links}
              closeMenu={closeMenu}
            />
          );
        })
      )}
    </Drawer>
  );
};
