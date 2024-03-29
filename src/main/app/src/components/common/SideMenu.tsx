import React, { useState } from 'react';

import { Drawer, Paper, InputBase, Button, Box, Hidden } from '@mui/material';
import { includes, last } from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { MobileLanguageSelection } from '#/src/components/common/MobileLanguageSelection';
import { Murupolku } from '#/src/components/common/Murupolku';
import { SidebarValikko } from '#/src/components/common/SidebarValikko';
import { SIDEMENU_WIDTH } from '#/src/constants';
import { useContentful } from '#/src/hooks/useContentful';
import { getHeaderHeight, styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

import { SuosikitButton } from './SuosikitButton';
import { TextButtonLink } from './TextButtonLink';

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
};

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !includes(['isSmall'], prop),
})<{ isSmall: boolean }>(({ theme, isSmall }) => ({
  width: isSmall ? '100%' : SIDEMENU_WIDTH,
  flexShrink: 0,

  [`& .${classes.drawerPaper}`]: {
    marginTop: getHeaderHeight(theme),
    height: `calc(100% - ${getHeaderHeight(theme)}px)`,
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
}));

export const SideMenu = (props: {
  menuVisible?: boolean;
  isSmall: boolean;
  closeMenu: () => void;
}) => {
  const { menuVisible, closeMenu } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useContentful();
  const [selected, setSelected] = useState<Array<string>>([]);
  const [search, setSearch] = useState('');

  const { valikot, valikko } = data;
  const selectValikko = (newValikkoId: string) =>
    setSelected([...selected, newValikkoId]);
  const popSelected = () => setSelected(selected.slice(0, -1));
  const lastSelected = last(selected);
  const selectedValikko = lastSelected ? (valikko ?? {})[lastSelected] : undefined;
  const linkit = selectedValikko
    ? [selectedValikko]
    : (getOne(valikot)?.valikot ?? []).map((v) => valikko[v.id]);

  const doSearch = (event: React.SyntheticEvent) => {
    event.preventDefault();
    navigate(`/${i18n.language}/sisaltohaku/?hakusana=${search}`);
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
      isSmall={props.isSmall}>
      <div className={classes.inputBackground}>
        <Hidden smUp>
          <Box mb={2} display="flex" flexDirection="column" alignItems="flex-start">
            <SuosikitButton onClick={closeMenu} />
            <TextButtonLink
              href={urls.url('oma-opintopolku')}
              target="_blank"
              startIcon={<MaterialIcon icon="apps" />}>
              {t('oma-opintopolku')}
            </TextButtonLink>
            <MobileLanguageSelection />
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
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                doSearch(event);
              }
            }}
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
            <MaterialIcon icon="search" />
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
