import React, { useCallback, useState } from 'react';

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
import { KOULUTUS_TYYPPI } from '#/src/constants';
import {
  localize,
  getLocalizedMaksullisuus,
  localizeArrayToCommaSeparated,
} from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { RajainName } from '#/src/types/common';
import { RajainBackendItem } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { useKoulutusJarjestajat } from './hooks';
import { useToteutusRajainOrder } from './useToteutusRajainOrder';
import { useSelectedFilters } from '../haku/hakutulosHooks';
import { SuodatinValinnat } from '../suodattimet/hakutulosSuodattimet/SuodatinValinnat';
import { MobileFiltersOnTopMenu } from '../suodattimet/toteutusSuodattimet/MobileFiltersOnTopMenu';

type Props = {
  oid: string;
  koulutustyyppi: string;
};

export type RajainOptions = Record<string, Record<string, RajainBackendItem>>;

type JarjestajaData = {
  total: number;
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  sortedFilters: Record<RajainName, any>;
};

const SuodatinGridItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Grid item sx={{ minWidth: '250px' }} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

const getRajainProps = ({
  id,
  setPreventClicks,
}: {
  id: string;
  setPreventClicks: React.Dispatch<React.SetStateAction<boolean>>;
}) =>
  match(id)
    .with('sijainti', () => ({
      onFocus: () => setPreventClicks(true),
      onHide: () => setPreventClicks(false),
    }))
    .otherwise(() => ({}));

export const ToteutusList = ({ oid, koulutustyyppi }: Props) => {
  const { t } = useTranslation();

  const { queryResult, rajainValues, setRajainValues, pagination, setPagination } =
    useKoulutusJarjestajat({
      oid,
    });

  const { data = {}, isLoading } = queryResult;

  const { sortedFilters, jarjestajat, total } = data as JarjestajaData;

  const allSelectedFilters = useSelectedFilters(sortedFilters, rajainValues);

  const someSelected = allSelectedFilters.flat.length > 0;

  const handleFiltersClear = useCallback(() => {
    const usedFilters = mapValues(rajainValues, (v, k) =>
      match(v)
        .with(P.array(P._), () => [])
        .with({ [`${k}_min`]: P.number, [`${k}_max`]: P.number }, () => ({
          [`${k}_min`]: 0,
          [`${k}_max`]: 0,
        }))
        .otherwise(() => false)
    );
    setRajainValues(usedFilters);
  }, [rajainValues, setRajainValues]);

  const someValuesToShow = isLoading || jarjestajat?.length > 0;

  const scrollTargetId = 'toteutus-list';

  const [preventClicks, setPreventClicks] = useState(false);

  const rajainOrder = useToteutusRajainOrder({ koulutustyyppi });

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
            {someSelected && (
              <div>
                <SuodatinValinnat
                  allSelectedFilters={allSelectedFilters}
                  setFilters={setRajainValues}
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
              {rajainOrder.map(({ Component, props, id }) => {
                const customProps = getRajainProps({ id, setPreventClicks });
                return (
                  <SuodatinGridItem key={id}>
                    <Component
                      elevation={2}
                      rajainOptions={sortedFilters}
                      rajainValues={rajainValues}
                      setFilters={setRajainValues}
                      loading={isLoading}
                      {...props}
                      {...customProps}
                    />
                  </SuodatinGridItem>
                );
              })}
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu
              koulutustyyppi={koulutustyyppi}
              rajainCount={size(allSelectedFilters?.flat)}
              loading={isLoading}
              hitCount={total}
              clearChosenFilters={handleFiltersClear}
              setFilters={setRajainValues}
              rajainValues={rajainValues}
              rajainOptions={sortedFilters}
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
