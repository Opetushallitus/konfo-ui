import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AppBar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  searchAndMoveToHaku,
  clearSelectedFilters,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getAllSelectedFilters } from '#/src/store/reducers/hakutulosSliceSelector';

import { HakutapaSuodatin } from './hakutulosSuodattimet/HakutapaSuodatin';
import { KoulutusalaSuodatin } from './hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from './hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetuskieliSuodatin } from './hakutulosSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './hakutulosSuodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from './hakutulosSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from './hakutulosSuodattimet/SijaintiSuodatin';
import { ValintatapaSuodatin } from './hakutulosSuodattimet/ValintatapaSuodatin';
import { MobileResultsPerPageExpansionMenu } from './MobileResultsPerPageExpansionMenu';
import { MobileToggleFiltersButton } from './MobileToggleFiltersButton';
import MobileToggleKoulutusOppilaitos from './MobileToggleKoulutusOppilaitos';
import MobileToggleOrderByButtonMenu from './MobileToggleOrderByButtonMenu';

const useStyles = makeStyles(() => ({
  paperAnchorBottom: {
    height: '100%',
  },
  appBarRoot: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  containerRoot: {
    marginTop: 60,
    // Calculation: Viewport height - Appbar height(60) -
    // ToggleFilter button height(40), bottom margin(30) and top margin(20))
    maxHeight: 'calc(100vh - 60px - 30px - 40px - 20px)',
    overflowY: 'scroll',
  },
  divider: {
    margin: '3px 0',
  },
}));

export const MobileFiltersOnTopMenu = ({ isFrontPage = false }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { koulutusTotal, oppilaitosTotal, selectedTab } = useSelector(
    (state: any) => ({
      koulutusTotal: state.hakutulos.koulutusTotal,
      oppilaitosTotal: state.hakutulos.oppilaitosTotal,
      selectedTab: state.hakutulos.selectedTab,
    }),
    shallowEqual
  );

  const hitCount = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusTotal : oppilaitosTotal),
    [selectedTab, koulutusTotal, oppilaitosTotal]
  );

  const { count } = useSelector(getAllSelectedFilters);

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  useEffect(() => {
    if (isFrontPage) {
      dispatch(newSearchAll());
    }
  }, [isFrontPage, dispatch]);

  const handleFiltersShowToggle = () => {
    if (isFrontPage) {
      dispatch(searchAndMoveToHaku({ history }));
    }
    toggleShowFilters();
  };

  const handleClearFilters = () => {
    dispatch(clearSelectedFilters());
    dispatch(newSearchAll());
  };

  return (
    <>
      {!showFilters && (
        <MobileToggleFiltersButton
          type={isFrontPage ? 'frontpage' : 'fixed'}
          chosenFilterCount={count}
          showFilters={showFilters}
          handleFiltersShowToggle={toggleShowFilters}
        />
      )}
      <SwipeableDrawer
        classes={{ paperAnchorBottom: classes.paperAnchorBottom }}
        anchor="bottom"
        onClose={toggleShowFilters}
        onOpen={toggleShowFilters}
        open={showFilters}>
        <AppBar classes={{ root: classes.appBarRoot }}>
          <Toolbar variant="dense" disableGutters>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              wrap="nowrap">
              <Grid item>
                <IconButton color="inherit" onClick={toggleShowFilters}>
                  <Close />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="body1" noWrap color="inherit">
                  {t('haku.rajaa-tuloksia')}
                </Typography>
              </Grid>
              <Grid item style={{ paddingRight: '10px' }}>
                {count > 0 && (
                  <Button
                    color="inherit"
                    classes={{ label: classes.buttonLabel }}
                    onClick={handleClearFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container classes={{ root: classes.containerRoot }}>
          {isFrontPage && <MobileToggleKoulutusOppilaitos />}
          {isFrontPage && <Divider className={classes.divider} />}
          <KoulutustyyppiSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <OpetuskieliSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <SijaintiSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <PohjakoulutusvaatimusSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <HakutapaSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <ValintatapaSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <KoulutusalaSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          <OpetustapaSuodatin expanded={false} displaySelected />
          <Divider className={classes.divider} />
          {!isFrontPage && <MobileToggleOrderByButtonMenu />}
          {!isFrontPage && <MobileResultsPerPageExpansionMenu />}
        </Container>
        <MobileToggleFiltersButton
          type="fixed"
          hitCount={hitCount}
          showFilters={showFilters}
          handleFiltersShowToggle={handleFiltersShowToggle}
        />
      </SwipeableDrawer>
    </>
  );
};
