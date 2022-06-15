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
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { MobileToggleFiltersButton } from '#/src/components/haku/hakutulos/MobileToggleFiltersButton';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { FilterValue } from '#/src/types/SuodatinTypes';

import { AmmOsaamisalatSuodatin } from './AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from './LukiolinjatSuodatin';

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
    height: '100%',
    overflowY: 'scroll',
  },
  divider: {
    margin: '3px 0',
  },
}));

type Props = {
  koulutustyyppi: string;
  values: Record<string, Array<FilterValue>>;
  hitCount: number;
  loading: boolean;
  handleFilterChange: (value: FilterValue) => void;
  clearChosenFilters: VoidFunction;
  setFilters: (value: any) => void;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  values,
  hitCount,
  loading,
  handleFilterChange,
  clearChosenFilters,
  setFilters,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  const chosenFilterCount = useMemo(
    () =>
      _fp.flow(
        _fp.map(
          (v: Array<FilterValue>) => v.filter((filterValue) => filterValue.checked).length
        ),
        _fp.sum
      )(values as any), // TS ei osaa päätellä tätä oikein
    [values]
  );

  return (
    <>
      {!showFilters && (
        <MobileToggleFiltersButton
          type="KOMO"
          chosenFilterCount={chosenFilterCount}
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
                {chosenFilterCount > 0 && (
                  <Button
                    color="inherit"
                    classes={{ label: classes.buttonLabel }}
                    onClick={clearChosenFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container classes={{ root: classes.containerRoot }}>
          <OpetuskieliSuodatin
            expanded={false}
            values={values.opetuskieli}
            isHaku={false}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <SijaintiSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            maakuntaValues={values.maakunta}
            kuntaValues={values.kunta}
            loading={loading}
            isHaku={false}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <PohjakoulutusvaatimusSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            values={values.pohjakoulutusvaatimus}
            isHaku={false}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          {values.hakukaynnissa && values.hakutapa && (
            <HakutapaSuodatin
              handleFilterChange={handleFilterChange}
              expanded={false}
              values={[...values.hakukaynnissa, ...values.hakutapa]}
              isHaku={false}
              setFilters={setFilters}
            />
          )}
          <Divider className={classes.divider} />
          {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
            <>
              <ValintatapaSuodatin
                handleFilterChange={handleFilterChange}
                expanded={false}
                values={values.valintatapa}
                isHaku={false}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          {koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && (
            <>
              {/*TODO*/}
              <LukiolinjatSuodatin
                name="lukiopainotukset"
                handleFilterChange={handleFilterChange}
                expanded={false}
                values={values.lukiopainotukset}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
              {/*TODO*/}
              <LukiolinjatSuodatin
                name="lukiolinjat_er"
                handleFilterChange={handleFilterChange}
                expanded={false}
                values={values.lukiolinjaterityinenkoulutustehtava}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
            <>
              {/*TODO*/}
              <AmmOsaamisalatSuodatin
                handleFilterChange={handleFilterChange}
                expanded={false}
                values={values.osaamisala}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          <OpetustapaSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            values={values.opetustapa}
            isHaku={false}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
        </Container>
        <MobileToggleFiltersButton
          type="fixed"
          chosenFilterCount={chosenFilterCount}
          hitCount={hitCount}
          showFilters={showFilters}
          handleFiltersShowToggle={toggleShowFilters}
        />
      </SwipeableDrawer>
    </>
  );
};
