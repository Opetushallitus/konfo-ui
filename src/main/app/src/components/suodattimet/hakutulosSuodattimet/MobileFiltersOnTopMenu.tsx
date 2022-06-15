import React, { useCallback, useMemo, useState } from 'react';

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

import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { HakutapaSuodatin } from '../common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '../common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '../common/ValintatapaSuodatin';
import { useAllSelectedFilters, useSearch } from '../../haku/hakutulosHooks';
import { KoulutusalaSuodatin } from './KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from './KoulutustyyppiSuodatin';
import { MobileResultsPerPageExpansionMenu } from '../../haku/hakutulos/MobileResultsPerPageExpansionMenu';
import { MobileToggleFiltersButton } from '../../haku/hakutulos/MobileToggleFiltersButton';
import MobileToggleKoulutusOppilaitos from '../../haku/hakutulos/MobileToggleKoulutusOppilaitos';
import MobileToggleOrderByButtonMenu from '../../haku/hakutulos/MobileToggleOrderByButtonMenu';

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

export const MobileFiltersOnTopMenu = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const isAtEtusivu = useIsAtEtusivu();

  const {
    koulutusData,
    oppilaitosData,
    selectedTab,
    clearFilters,
    goToSearchPage,
    setFilters,
  } = useSearch();

  const hitCount = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusData?.total : oppilaitosData?.total),
    [selectedTab, koulutusData, oppilaitosData]
  );

  const { count } = useAllSelectedFilters();

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  const handleFiltersShowToggle = () => {
    if (isAtEtusivu) {
      goToSearchPage();
    }
    toggleShowFilters();
  };

  return (
    <>
      {!showFilters && (
        <MobileToggleFiltersButton
          type={isAtEtusivu ? 'frontpage' : 'fixed'}
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
                    onClick={clearFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container classes={{ root: classes.containerRoot }}>
          {isAtEtusivu && <MobileToggleKoulutusOppilaitos />}
          {isAtEtusivu && <Divider className={classes.divider} />}
          <KoulutustyyppiSuodatin
            expanded={false}
            displaySelected
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <OpetuskieliSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <SijaintiSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <PohjakoulutusvaatimusSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <HakutapaSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <ValintatapaSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <KoulutusalaSuodatin expanded={false} displaySelected setFilters={setFilters} />
          <Divider className={classes.divider} />
          <OpetustapaSuodatin
            expanded={false}
            displaySelected
            isHaku={true}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          {!isAtEtusivu && <MobileToggleOrderByButtonMenu />}
          {!isAtEtusivu && <MobileResultsPerPageExpansionMenu />}
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
