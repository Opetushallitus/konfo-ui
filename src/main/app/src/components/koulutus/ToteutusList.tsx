import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Container, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PublicIcon from '@material-ui/icons/Public';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { QueryResultWrapper } from '#/src/components/common/QueryResultWrapper';
import Spacer from '#/src/components/common/Spacer';
import { TarjontaPagination } from '#/src/components/common/TarjontaPagination';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';
import { FILTER_TYPES } from '#/src/constants';
import { usePreviousNonEmpty } from '#/src/hooks';
import { getInitialCheckedToteutusFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  getFilterStateChanges,
  getFilterWithChecked,
  sortValues,
} from '#/src/tools/filters';
import {
  localize,
  getLocalizedMaksullisuus,
  localizeArrayToCommaSeparated,
} from '#/src/tools/localization';
import { mapValues } from '#/src/tools/lodashFpUncapped';
import { FilterValue } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { useKoulutusJarjestajat } from './hooks';
import { HakutapaSuodatin } from './toteutusSuodattimet/HakutapaSuodatin';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';
import { OpetuskieliSuodatin } from './toteutusSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './toteutusSuodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from './toteutusSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from './toteutusSuodattimet/SijaintiSuodatin';
import { ValintatapaSuodatin } from './toteutusSuodattimet/ValintatapaSuodatin';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
  grid: {
    maxWidth: '900px',
  },
  filtersContainer: {
    marginBottom: '16px',
  },
  filter: {
    minWidth: '250px',
  },
});

type Props = {
  oid: string;
};

type JarjestajaData = {
  total: number;
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  sortedFilters: Record<string, Record<string, FilterValue>>;
};

const getQueryStr = (values: Record<string, Array<string> | boolean>) => {
  // TODO: konfo-backend haluaa maakunta ja kunta -rajainten sijaan "sijainti" -rajaimen, pitäisi refaktoroida sinne maakunta + kunta käyttöön
  const valuesWithSijainti = _fp.omit(
    ['kunta', 'maakunta', 'koulutusala', 'koulutustyyppi', 'koulutustyyppi-muu'],
    {
      ...values,
      sijainti: [
        ...(values.maakunta as Array<string>),
        ...(values.kunta as Array<string>),
      ],
    }
  );

  return _fp.mapValues(
    (v) => (_fp.isArray(v) ? v!.join(',') : v!.toString()),
    valuesWithSijainti
  );
};

const SuodatinGridItem: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid item className={classes.filter} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

export const ToteutusList = ({ oid }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten + Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getInitialCheckedToteutusFilters
  );

  const { queryResult, setFilters, setPagination, pagination } = useKoulutusJarjestajat({
    oid,
  });

  const { data = {}, isLoading } = queryResult;

  const { sortedFilters, jarjestajat, total } = data as JarjestajaData;
  const [initialValues] = useState(initialCheckedFilters);

  const previousOid = usePreviousNonEmpty(oid);
  // Jos oid vaihtuu, initialisoi filtterit hakutulosten filttereistä
  useEffect(() => {
    if (oid !== previousOid) {
      const queryStrings = getQueryStr(initialValues);
      setFilters(queryStrings);
    }
  }, [oid, setFilters, initialValues, previousOid]);

  const [checkedValues, setCheckedValues] = useState<
    Record<string, Array<string> | boolean>
  >(initialValues);

  const usedValues = useMemo(
    () =>
      mapValues((ignored: any, key: string) =>
        sortValues(getFilterWithChecked(sortedFilters, checkedValues, key))
      )(sortedFilters),
    [sortedFilters, checkedValues]
  );

  const someSelected = _fp.some(
    (v) => (_fp.isArray(v) ? v.length > 0 : v),
    checkedValues
  );

  const handleFilterChange = (value: FilterValue) => {
    const { filterId } = value;
    let newCheckedValues: typeof checkedValues;

    // Käsitellään boolean-filter erikseen
    if (filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      const filter = checkedValues[filterId] as boolean;
      newCheckedValues = { ...checkedValues, [filterId]: !filter };
    } else {
      const newFilter = getFilterStateChanges(usedValues[filterId])(value);
      newCheckedValues = { ...checkedValues, ...newFilter };
    }

    setCheckedValues(newCheckedValues);
    const queryStrings = getQueryStr(newCheckedValues);
    setFilters(queryStrings);
  };

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues(
      (v) => (_fp.isArray(v) ? [] : false),
      checkedValues
    );
    setCheckedValues(usedFilters);
    const queryStrings = getQueryStr(usedFilters);
    setFilters(queryStrings);
  }, [checkedValues, setFilters]);

  const someValuesToShow = isLoading || jarjestajat?.length > 0;

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('koulutus.tarjonta')}</Typography>
      <Spacer />
      <>
        <Hidden smDown>
          <Grid
            container
            item
            direction="row"
            justify="center"
            spacing={2}
            className={classes.filtersContainer}
            sm={10}>
            <SuodatinGridItem>
              <OpetuskieliSuodatin
                elevation={2}
                handleFilterChange={handleFilterChange}
                values={usedValues.opetuskieli}
              />
            </SuodatinGridItem>
            <SuodatinGridItem>
              <SijaintiSuodatin
                elevation={2}
                loading={isLoading}
                handleFilterChange={handleFilterChange}
                maakuntaValues={usedValues.maakunta}
                kuntaValues={usedValues.kunta}
              />
            </SuodatinGridItem>
            <SuodatinGridItem>
              <PohjakoulutusvaatimusSuodatin
                elevation={2}
                handleFilterChange={handleFilterChange}
                values={usedValues.pohjakoulutusvaatimus}
              />
            </SuodatinGridItem>
            <SuodatinGridItem>
              <HakutapaSuodatin
                elevation={2}
                handleFilterChange={handleFilterChange}
                values={
                  usedValues.hakukaynnissa && usedValues.hakutapa
                    ? [...usedValues.hakukaynnissa, ...usedValues.hakutapa]
                    : []
                }
              />
            </SuodatinGridItem>
            <SuodatinGridItem>
              <ValintatapaSuodatin
                elevation={2}
                handleFilterChange={handleFilterChange}
                values={usedValues.valintatapa}
              />
            </SuodatinGridItem>
            <SuodatinGridItem>
              <OpetustapaSuodatin
                elevation={2}
                handleFilterChange={handleFilterChange}
                values={usedValues.opetustapa}
              />
            </SuodatinGridItem>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <MobileFiltersOnTopMenu
            values={usedValues}
            loading={isLoading}
            hitCount={total}
            handleFilterChange={handleFilterChange}
            clearChosenFilters={handleFiltersClear}
          />
        </Hidden>
      </>
      <TarjontaPagination
        total={total}
        pagination={pagination}
        setPagination={setPagination}
      />
      <QueryResultWrapper queryResult={queryResult}>
        <>
          {someValuesToShow ? (
            <Grid
              container
              direction="column"
              justify="center"
              className={classes.grid}
              alignItems="stretch"
              spacing={1}>
              {jarjestajat?.map((toteutus, i) => (
                <Grid item key={i}>
                  <EntiteettiKortti
                    koulutustyyppi={toteutus.koulutustyyppi}
                    to={`/toteutus/${toteutus.toteutusOid}`}
                    logoElement={
                      <OppilaitosKorttiLogo
                        image={toteutus.kuva}
                        alt={`${localize(toteutus.toteutusNimi)} ${t(
                          'koulutus.koulutuksen-teemakuva'
                        )}`}
                      />
                    }
                    preHeader={localize(toteutus)}
                    header={localize(toteutus.toteutusNimi)}
                    erityisopetusHeader={
                      toteutus.ammatillinenPerustutkintoErityisopetuksena ||
                      toteutus.jarjestetaanErityisopetuksena
                    }
                    kuvaus={localize(toteutus.kuvaus)}
                    wrapDirection="column-reverse"
                    iconTexts={[
                      [
                        localizeArrayToCommaSeparated(toteutus.kunnat, { sorted: true }),
                        PublicIcon,
                      ],
                      [
                        localizeArrayToCommaSeparated(toteutus.opetusajat, {
                          sorted: true,
                        }),
                        HourglassEmptyIcon,
                      ],
                      [
                        getLocalizedMaksullisuus(
                          toteutus.maksullisuustyyppi,
                          toteutus.maksunMaara
                        ),
                        EuroSymbolIcon,
                      ],
                      [
                        toteutus.hakukaynnissa ? (
                          <TextWithBackground>
                            {t('haku.hakukaynnissa')}
                          </TextWithBackground>
                        ) : (
                          <></>
                        ),
                        undefined,
                      ],
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" paragraph>
              {t(
                someSelected
                  ? 'koulutus.ei-rajaimia-vastaavia-toteutuksia'
                  : 'koulutus.ei-toteutuksia'
              )}
            </Typography>
          )}
        </>
      </QueryResultWrapper>
      <TarjontaPagination
        total={total}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Container>
  );
};
