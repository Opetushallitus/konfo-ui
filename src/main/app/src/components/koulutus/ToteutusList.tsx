import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PublicIcon from '@material-ui/icons/Public';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';
import { QueryResultWrapper } from '#/src/components/common/QueryResultWrapper';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';
import { HakutapaSuodatin } from '#/src/components/suodattimet/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/OpetustapaSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/ValintatapaSuodatin';
import { FILTER_TYPES } from '#/src/constants';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { usePreviousNonEmpty } from '#/src/hooks';
import { usePreviousPage } from '#/src/store/reducers/appSlice';
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
import { AmmOsaamisalatSuodatin } from './toteutusSuodattimet/AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from './toteutusSuodattimet/LukiolinjatSuodatin';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';
import { SijaintiSuodatin } from './toteutusSuodattimet/SijaintiSuodatin';
import {PohjakoulutusvaatimusSuodatin} from "#/src/components/suodattimet/PohjakoulutusvaatimusSuodatin";

const useStyles = makeStyles({
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
  koulutustyyppi: string;
};

type JarjestajaData = {
  total: number;
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  sortedFilters: Record<string, Record<string, FilterValue>>;
};

const SuodatinGridItem: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid item className={classes.filter} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

export const ToteutusList = ({ oid, koulutustyyppi }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten + Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getInitialCheckedToteutusFilters
  );

  const { queryResult, setFilters, setPagination, pagination, filters } =
    useKoulutusJarjestajat({
      oid,
    });

  const { data = {}, isLoading } = queryResult;

  const { sortedFilters, jarjestajat, total } = data as JarjestajaData;
  const [initialValues] = useState(initialCheckedFilters);

  const previousOid = usePreviousNonEmpty(oid);

  const previousPage = usePreviousPage();

  const isComingFromHakuPage = previousPage === 'haku';

  // Jos oid vaihtuu ja tullaan hakusivulta, initialisoi filtterit hakutulosten filttereistä
  useEffect(() => {
    if (oid !== previousOid && isComingFromHakuPage) {
      setFilters(initialValues);
      setPagination({ offset: 0 });
    }
  }, [oid, setFilters, initialValues, previousOid, isComingFromHakuPage, setPagination]);

  const usedValues = useMemo(
    () =>
      mapValues((_value: any, key: string) =>
        sortValues(getFilterWithChecked(sortedFilters, filters, key))
      )(sortedFilters),
    [sortedFilters, filters]
  );

  const someSelected = _fp.some((v) => (_fp.isArray(v) ? v.length > 0 : v), filters);

  const handleFilterChange = useCallback(
    (value: FilterValue) => {
      const { filterId } = value;
      let newFilters: typeof filters;

      // Käsitellään boolean-filter erikseen
      if (filterId === FILTER_TYPES.HAKUKAYNNISSA) {
        const filter = filters[filterId] as boolean;
        newFilters = { ...filters, [filterId]: !filter };
      } else {
        const newFilter = getFilterStateChanges(usedValues[filterId])(value);
        newFilters = { ...filters, ...newFilter };
      }

      setFilters(newFilters);
    },
    [filters, setFilters, usedValues]
  );

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues((v) => (_fp.isArray(v) ? [] : false), filters);

    setFilters(usedFilters);
  }, [filters, setFilters]);

  const someValuesToShow = isLoading || jarjestajat?.length > 0;

  const scrollTargetId = 'toteutus-list';

  const [preventClicks, setPreventClicks] = useState(false);

  return (
    <div>
      <PageSection
        heading={
          <Typography variant="h2" id={scrollTargetId}>
            {t('koulutus.tarjonta')}
          </Typography>
        }>
        <>
          <Hidden smDown>
            <Grid
              container
              item
              direction="row"
              justifyContent="center"
              spacing={2}
              className={classes.filtersContainer}
              sm={10}>
              <SuodatinGridItem>
                <OpetuskieliSuodatin
                  elevation={2}
                  handleFilterChange={handleFilterChange}
                  values={usedValues.opetuskieli}
                  isHaku={false}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <SijaintiSuodatin
                  elevation={2}
                  loading={isLoading}
                  handleFilterChange={handleFilterChange}
                  maakuntaValues={usedValues.maakunta}
                  kuntaValues={usedValues.kunta}
                  onFocus={() => {
                    setPreventClicks(true);
                  }}
                  onHide={() => {
                    setPreventClicks(false);
                  }}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <PohjakoulutusvaatimusSuodatin
                  elevation={2}
                  handleFilterChange={handleFilterChange}
                  values={usedValues.pohjakoulutusvaatimus}
                  isHaku={false}
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
                  isHaku={false}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OpetustapaSuodatin
                  elevation={2}
                  handleFilterChange={handleFilterChange}
                  values={usedValues.opetustapa}
                  isHaku={false}
                />
              </SuodatinGridItem>
              {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
                <SuodatinGridItem>
                  <ValintatapaSuodatin
                    elevation={2}
                    handleFilterChange={handleFilterChange}
                    values={usedValues.valintatapa}
                    isHaku={false}
                  />
                </SuodatinGridItem>
              )}
              {koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && (
                <Grid
                  item
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  className={classes.filtersContainer}
                  sm={12}>
                  <SuodatinGridItem>
                    <LukiolinjatSuodatin
                      name="lukiopainotukset"
                      elevation={2}
                      handleFilterChange={handleFilterChange}
                      values={usedValues.lukiopainotukset}
                    />
                  </SuodatinGridItem>
                  <SuodatinGridItem>
                    <LukiolinjatSuodatin
                      name="lukiolinjat_er"
                      elevation={2}
                      handleFilterChange={handleFilterChange}
                      values={usedValues.lukiolinjaterityinenkoulutustehtava}
                    />
                  </SuodatinGridItem>
                </Grid>
              )}
              {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
                <SuodatinGridItem>
                  <AmmOsaamisalatSuodatin
                    elevation={2}
                    handleFilterChange={handleFilterChange}
                    values={usedValues.osaamisala}
                  />
                </SuodatinGridItem>
              )}
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu
              koulutustyyppi={koulutustyyppi}
              values={usedValues}
              loading={isLoading}
              hitCount={total}
              handleFilterChange={handleFilterChange}
              clearChosenFilters={handleFiltersClear}
            />
          </Hidden>
        </>
        <Pagination total={total} pagination={pagination} setPagination={setPagination} />
        <QueryResultWrapper queryResult={queryResult}>
          <>
            {someValuesToShow ? (
              <Grid
                container
                direction="column"
                justifyContent="center"
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
                      wrapIconTexts={true}
                      iconTexts={[
                        [
                          localizeArrayToCommaSeparated(toteutus.kunnat, {
                            sorted: true,
                          }),
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
                          toteutus.hakuAuki ? (
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
        <Pagination
          total={total}
          pagination={pagination}
          setPagination={setPagination}
          scrollTargetId={scrollTargetId}
        />
      </PageSection>
      <div
        id="prevent-clicks"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          opacity: 0.5,
          zIndex: 1,
          display: preventClicks ? 'block' : 'none',
        }}
        onClick={(e) => {
          setPreventClicks(false);
          e.stopPropagation();
        }}></div>
    </div>
  );
};
