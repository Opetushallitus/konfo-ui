import React, { useCallback, useMemo, useState } from 'react';

import { Close } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { MobileToggleFiltersButton } from '#/src/components/haku/hakutulos/MobileToggleFiltersButton';
import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
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

const PREFIX = 'ToteutusMobileFiltersOnTopMenu';

const classes = {
  paperAnchorBottom: `${PREFIX}-paperAnchorBottom`,
  appBarRoot: `${PREFIX}-appBarRoot`,
  buttonLabel: `${PREFIX}-buttonLabel`,
  containerRoot: `${PREFIX}-containerRoot`,
  divider: `${PREFIX}-divider`,
};

const StyledSwipeableDrawer = styled(SwipeableDrawer)(() => ({
  zIndex: 1222,
  [`& .${classes.paperAnchorBottom}`]: {
    height: '100%',
  },

  [`& .${classes.appBarRoot}`]: {
    height: 50,
  },

  [`& .${classes.buttonLabel}`]: {
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  [`& .${classes.containerRoot}`]: {
    marginTop: 60,
    height: '100%',
    overflowY: 'scroll',
  },

  [`& .${classes.divider}`]: {
    margin: '3px 0',
  },
}));

type Props = {
  koulutustyyppi: string;
  values: Record<string, Array<FilterValue>>;
  hitCount: number;
  loading: boolean;
  clearChosenFilters: VoidFunction;
  setFilters: (value: any) => void;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  values,
  hitCount,
  loading,
  clearChosenFilters,
  setFilters,
}: Props) => {
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
    <React.Fragment>
      {!showFilters && (
        <MobileToggleFiltersButton
          type="KOMO"
          chosenFilterCount={chosenFilterCount}
          showFilters={showFilters}
          handleFiltersShowToggle={toggleShowFilters}
        />
      )}
      <StyledSwipeableDrawer
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
                    classes={{ text: classes.buttonLabel }}
                    onClick={clearChosenFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container className={classes.containerRoot}>
          <OpetuskieliSuodatin
            expanded={false}
            values={values.opetuskieli}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <SijaintiSuodatin
            expanded={false}
            maakuntaValues={values.maakunta}
            kuntaValues={values.kunta}
            loading={loading}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          <PohjakoulutusvaatimusSuodatin
            expanded={false}
            values={values.pohjakoulutusvaatimus}
            setFilters={setFilters}
          />
          <Divider className={classes.divider} />
          {values.hakukaynnissa && (
            <HakuKaynnissaSuodatin
              expanded={false}
              values={values.hakukaynnissa}
              setFilters={setFilters}
            />
          )}
          <Divider className={classes.divider} />
          {values.hakutapa && (
            <HakutapaSuodatin
              expanded={false}
              values={values.hakutapa}
              setFilters={setFilters}
            />
          )}
          <Divider className={classes.divider} />
          {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
            <>
              <ValintatapaSuodatin
                expanded={false}
                values={values.valintatapa}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          {koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && (
            <>
              <LukiolinjatSuodatin
                name="lukiopainotukset"
                expanded={false}
                values={values.lukiopainotukset}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
              <LukiolinjatSuodatin
                name="lukiolinjat_er"
                expanded={false}
                values={values.lukiolinjaterityinenkoulutustehtava}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
            <>
              <AmmOsaamisalatSuodatin
                expanded={false}
                values={values.osaamisala}
                setFilters={setFilters}
              />
              <Divider className={classes.divider} />
            </>
          )}
          <OpetustapaSuodatin
            expanded={false}
            values={values.opetustapa}
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
      </StyledSwipeableDrawer>
    </React.Fragment>
  );
};
