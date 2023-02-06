import React, { useCallback, useEffect, useMemo, useState } from 'react';

import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PublicIcon from '@mui/icons-material/Public';
import { Box, Grid, Hidden, Typography } from '@mui/material';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';
import { QueryResultWrapper } from '#/src/components/common/QueryResultWrapper';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';
import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { OppilaitosSuodatin } from '#/src/components/suodattimet/common/OppilaitosSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { AmmOsaamisalatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/AmmOsaamisalatSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { usePreviousNonEmpty } from '#/src/hooks';
import { usePreviousPage } from '#/src/store/reducers/appSlice';
import { getInitialCheckedToteutusFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  getFilterWithChecked,
  sortValues,
  getFilterStateChangesForDelete,
} from '#/src/tools/filters';
import {
  localize,
  getLocalizedMaksullisuus,
  localizeArrayToCommaSeparated,
} from '#/src/tools/localization';
import { mapValues } from '#/src/tools/lodashFpUncapped';
import { getLocalizedToteutusLaajuus } from '#/src/tools/utils';
import { FilterValue } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { ChipList } from '../suodattimet/hakutulosSuodattimet/SuodatinValinnat';
import { LukiolinjatSuodatin } from '../suodattimet/toteutusSuodattimet/LukiolinjatSuodatin';
import { MobileFiltersOnTopMenu } from '../suodattimet/toteutusSuodattimet/MobileFiltersOnTopMenu';
import { useKoulutusJarjestajat } from './hooks';

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
  return (
    <Grid item sx={{ minWidth: '250px' }} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

export const ToteutusList = ({ oid, koulutustyyppi }: Props) => {
  const { t } = useTranslation();

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

  const selectedFiltersFlatList = useMemo(() => {
    const idsMatch = (id: string) => (val: FilterValue) => val.id === id;
    return Object.keys(filters)
      .map((k: string) => {
        if (!filters[k].map) {
          const booleanValue = filters[k];
          return booleanValue
            ? [
                {
                  checked: true,
                  id: k,
                  count: 1,
                  filterId: k,
                },
              ]
            : [];
        }
        return filters[k]
          .map((v: FilterValue) => [v, ...(v.alakoodit || [])])
          .flat()
          .map((v: string) => {
            const matchingFilter =
              usedValues[k]?.find(idsMatch(v)) ||
              usedValues[k]
                ?.map((val: FilterValue) => val.alakoodit)
                .flat()
                .find(idsMatch(v));
            return {
              checked: true,
              id: v,
              count: matchingFilter ? matchingFilter.count : 0,
              filterId: k,
              nimi: matchingFilter?.nimi,
            };
          });
      })
      .flat();
  }, [usedValues, filters]);

  const handleCheck = (item: FilterValue) => () => {
    const values = usedValues[item.filterId];
    const changes = getFilterStateChangesForDelete(values)(item);
    setFilters(changes);
  };

  const someSelected = _fp.some((v) => (_fp.isArray(v) ? v.length > 0 : v), filters);

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues((v) => (_fp.isArray(v) ? [] : false), filters);

    setFilters(usedFilters);
  }, [filters, setFilters]);

  const someValuesToShow = isLoading || jarjestajat?.length > 0;

  const scrollTargetId = 'toteutus-list';

  const [preventClicks, setPreventClicks] = useState(false);

  return (
    <Box>
      <PageSection
        heading={
          <Typography variant="h2" id={scrollTargetId}>
            {t('koulutus.tarjonta')}
          </Typography>
        }>
        <>
          <Hidden smDown>
            {selectedFiltersFlatList.length > 0 && (
              <div>
                <ChipList
                  filters={selectedFiltersFlatList}
                  getHandleDelete={handleCheck}
                  handleClearFilters={handleFiltersClear}
                />
              </div>
            )}

            <Grid
              container
              item
              direction="row"
              justifyContent="center"
              mb={2}
              spacing={2}
              sm={10}>
              <SuodatinGridItem>
                <OpetuskieliSuodatin
                  elevation={2}
                  values={usedValues.opetuskieli}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <SijaintiSuodatin
                  elevation={2}
                  loading={isLoading}
                  maakuntaValues={usedValues.maakunta}
                  kuntaValues={usedValues.kunta}
                  onFocus={() => {
                    setPreventClicks(true);
                  }}
                  onHide={() => {
                    setPreventClicks(false);
                  }}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <PohjakoulutusvaatimusSuodatin
                  elevation={2}
                  values={usedValues.pohjakoulutusvaatimus}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <HakuKaynnissaSuodatin
                  elevation={2}
                  values={usedValues.hakukaynnissa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <HakutapaSuodatin
                  elevation={2}
                  values={usedValues.hakutapa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OpetustapaSuodatin
                  elevation={2}
                  values={usedValues.opetustapa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OppilaitosSuodatin
                  elevation={2}
                  values={usedValues.oppilaitos}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
                <SuodatinGridItem>
                  <ValintatapaSuodatin
                    elevation={2}
                    values={usedValues.valintatapa}
                    setFilters={setFilters}
                  />
                </SuodatinGridItem>
              )}
              {koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && (
                <>
                  <SuodatinGridItem>
                    <LukiolinjatSuodatin
                      name="lukiopainotukset"
                      elevation={2}
                      values={usedValues.lukiopainotukset}
                      setFilters={setFilters}
                    />
                  </SuodatinGridItem>
                  <SuodatinGridItem>
                    <LukiolinjatSuodatin
                      name="lukiolinjat_er"
                      elevation={2}
                      values={usedValues.lukiolinjaterityinenkoulutustehtava}
                      setFilters={setFilters}
                    />
                  </SuodatinGridItem>
                </>
              )}
              {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
                <SuodatinGridItem>
                  <AmmOsaamisalatSuodatin
                    elevation={2}
                    values={usedValues.osaamisala}
                    setFilters={setFilters}
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
              clearChosenFilters={handleFiltersClear}
              setFilters={setFilters}
            />
          </Hidden>
        </>
        <Pagination total={total} pagination={pagination} setPagination={setPagination} />
        <QueryResultWrapper queryResult={queryResult}>
          {someValuesToShow ? (
            <Box
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '900px',
              }}>
              {jarjestajat?.map((toteutus) => (
                <Box key={toteutus.toteutusOid}>
                  <EntiteettiKortti
                    koulutustyyppi={toteutus.koulutustyyppi}
                    to={`/toteutus/${toteutus.toteutusOid}`}
                    logoElement={<OppilaitosKorttiLogo image={toteutus.kuva} alt="" />}
                    preHeader={localize(toteutus)}
                    header={localize(toteutus.toteutusNimi)}
                    erityisopetusHeader={
                      toteutus.ammatillinenPerustutkintoErityisopetuksena ||
                      toteutus.jarjestetaanErityisopetuksena
                    }
                    jarjestaaUrheilijanAmmKoulutusta={
                      toteutus.jarjestaaUrheilijanAmmKoulutusta
                    }
                    kuvaus={localize(toteutus.kuvaus)}
                    opintojenLaajuus={getLocalizedToteutusLaajuus(toteutus)}
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
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" paragraph>
              {t(
                someSelected
                  ? 'koulutus.ei-rajaimia-vastaavia-toteutuksia'
                  : 'koulutus.ei-toteutuksia'
              )}
            </Typography>
          )}
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
    </Box>
  );
};
