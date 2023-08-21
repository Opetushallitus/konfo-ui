import React, { useCallback, useMemo, useState } from 'react';

import { Box, Grid, Hidden, Typography } from '@mui/material';
import { mapValues, size } from 'lodash';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
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
import { getRajainValueInUIFormat } from '#/src/tools/filters';
import {
  localize,
  getLocalizedMaksullisuus,
  localizeArrayToCommaSeparated,
} from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { RajainBackendItem } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { useKoulutusJarjestajat } from './hooks';
import { useSelectedFilters } from '../haku/hakutulosHooks';
import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';
import { SuodatinValinnat } from '../suodattimet/hakutulosSuodattimet/SuodatinValinnat';
import { LukiolinjatSuodatin } from '../suodattimet/toteutusSuodattimet/LukiolinjatSuodatin';
import { MobileFiltersOnTopMenu } from '../suodattimet/toteutusSuodattimet/MobileFiltersOnTopMenu';

type Props = {
  oid: string;
  koulutustyyppi: string;
};

type JarjestajaData = {
  total: number;
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  sortedFilters: Record<string, Record<string, RajainBackendItem>>;
};

const SuodatinGridItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Grid item sx={{ minWidth: '250px' }} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

export const ToteutusList = ({ oid, koulutustyyppi }: Props) => {
  const { t } = useTranslation();

  // TODO: filters todella hämmentävä nimi tässä
  const { queryResult, setFilters, setPagination, pagination, filters } =
    useKoulutusJarjestajat({
      oid,
    });

  const { data = {}, isLoading } = queryResult;

  const { sortedFilters, jarjestajat, total } = data as JarjestajaData;

  const usedValues: any = useMemo(
    () =>
      mapValues(sortedFilters, (_value, key: string) =>
        getRajainValueInUIFormat(sortedFilters, filters, key)
      ),
    [sortedFilters, filters]
  );

  const allSelectedFilters = useSelectedFilters(sortedFilters, filters);

  const someSelected = allSelectedFilters.flat.length > 0;

  const handleFiltersClear = useCallback(() => {
    const usedFilters = mapValues(filters, (v, k) =>
      match(v)
        .with(P.array(P._), () => [])
        .with({ [`${k}_min`]: P.number, [`${k}_max`]: P.number }, () => ({
          [`${k}_min`]: 0,
          [`${k}_max`]: 0,
        }))
        .otherwise(() => false)
    );
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
          <Hidden mdDown>
            {size(allSelectedFilters?.flat) > 0 && (
              <div>
                <SuodatinValinnat
                  allSelectedFilters={allSelectedFilters}
                  setFilters={setFilters}
                  clearFilters={handleFiltersClear}
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
                  rajainValues={usedValues.opetuskieli}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <SijaintiSuodatin
                  elevation={2}
                  loading={isLoading}
                  maakuntaRajainValues={usedValues.maakunta}
                  kuntaRajainValues={usedValues.kunta}
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
                  rajainValues={usedValues.pohjakoulutusvaatimus}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <HakuKaynnissaSuodatin
                  elevation={2}
                  rajainValues={usedValues.hakukaynnissa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <HakutapaSuodatin
                  elevation={2}
                  rajainValues={usedValues.hakutapa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OpetustapaSuodatin
                  elevation={2}
                  rajainValues={usedValues.opetustapa}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OppilaitosSuodatin
                  elevation={2}
                  rajainValues={usedValues.oppilaitos}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <OpetusaikaSuodatin
                  elevation={2}
                  rajainValues={usedValues.opetusaika}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <KoulutuksenKestoSuodatin
                  elevation={2}
                  rajainValues={usedValues.koulutuksenkestokuukausina}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <AlkamiskausiSuodatin
                  elevation={2}
                  rajainValues={usedValues.alkamiskausi}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              <SuodatinGridItem>
                <MaksullisuusSuodatin
                  elevation={2}
                  rajainValues={usedValues.maksullisuus}
                  setFilters={setFilters}
                />
              </SuodatinGridItem>
              {KORKEAKOULU_KOULUTUSTYYPIT.includes(koulutustyyppi as KOULUTUS_TYYPPI) && (
                <SuodatinGridItem>
                  <ValintatapaSuodatin
                    elevation={2}
                    rajainValues={usedValues.valintatapa}
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
                      rajainValues={usedValues.lukiopainotukset}
                      setFilters={setFilters}
                    />
                  </SuodatinGridItem>
                  <SuodatinGridItem>
                    <LukiolinjatSuodatin
                      name="lukiolinjat_er"
                      elevation={2}
                      rajainValues={usedValues.lukiolinjaterityinenkoulutustehtava}
                      setFilters={setFilters}
                    />
                  </SuodatinGridItem>
                </>
              )}
              {koulutustyyppi === KOULUTUS_TYYPPI.AMM && (
                <SuodatinGridItem>
                  <AmmOsaamisalatSuodatin
                    elevation={2}
                    rajainValues={usedValues.osaamisala}
                    setFilters={setFilters}
                  />
                </SuodatinGridItem>
              )}
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu
              koulutustyyppi={koulutustyyppi}
              rajainCount={size(allSelectedFilters?.flat)}
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
                    opintojenLaajuus={match(koulutustyyppi)
                      .with(
                        KOULUTUS_TYYPPI.KK_OPINTOJAKSO,
                        KOULUTUS_TYYPPI.KK_OPINTOKOKONAISUUS,
                        () => getLocalizedOpintojenLaajuus(toteutus)
                      )
                      .otherwise(() => undefined)}
                    wrapIconTexts={true}
                    iconTexts={[
                      [
                        localizeArrayToCommaSeparated(toteutus.kunnat, {
                          sorted: true,
                        }),
                        createMaterialIcon('public'),
                      ],
                      [
                        localizeArrayToCommaSeparated(toteutus.opetusajat, {
                          sorted: true,
                        }),
                        createMaterialIcon('hourglass_empty'),
                      ],
                      [
                        getLocalizedMaksullisuus(
                          toteutus.maksullisuustyyppi,
                          toteutus.maksunMaara
                        ),
                        createMaterialIcon('euro_symbol'),
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
