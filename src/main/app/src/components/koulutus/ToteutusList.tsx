import React from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';
import { QueryResultWrapper } from '#/src/components/common/QueryResultWrapper';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { useToteutusRajainOrder } from '#/src/hooks/useToteutusRajainOrder';
import { getLocalizedMaksullisuus } from '#/src/tools/getLocalizedMaksullisuus';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { KoutaKoulutustyyppi, RajainName, TODOType } from '#/src/types/common';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { useKoulutusJarjestajat } from './hooks';
import { useSelectedFilters } from '../haku/hakutulosHooks';
import { RajainFiltersBar } from '../suodattimet/RajainFiltersBar';

type Props = {
  oid?: string;
  koulutustyyppi?: KoutaKoulutustyyppi;
};

export type RajainOptions = Record<string, Record<string, TODOType>>;

type JarjestajaData = {
  total: number;
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  rajainOptions: Record<RajainName, any>;
};

export const ToteutusList = ({ oid, koulutustyyppi }: Props) => {
  const { t } = useTranslation();

  const {
    queryResult,
    rajainValues,
    setRajainValues,
    pagination,
    setPagination,
    clearRajainValues,
  } = useKoulutusJarjestajat({
    oid,
  });

  const { data = {}, isLoading } = queryResult;

  const { rajainOptions, jarjestajat, total } = data as JarjestajaData;

  const allSelectedFilters = useSelectedFilters(rajainOptions, rajainValues);

  const someSelected = allSelectedFilters.flat.length > 0;

  const someValuesToShow = isLoading || jarjestajat?.length > 0;

  const scrollTargetId = 'toteutus-list';

  const rajainOrder = useToteutusRajainOrder({ koulutustyyppi });

  return (
    <Box>
      <PageSection
        heading={t('koulutus.tarjonta')}
        headingProps={{
          id: scrollTargetId,
        }}>
        <RajainFiltersBar
          rajainOrder={rajainOrder}
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setRajainValues={setRajainValues}
          clearRajainValues={clearRajainValues}
          allSelectedFilters={allSelectedFilters}
          loading={isLoading}
          hitCount={total}
        />
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
                          toteutus?.koulutustyyppi,
                          toteutus?.maksullisuustyypit,
                          toteutus?.maksunMaara,
                          toteutus?.lukuvuosimaksunMaara
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
    </Box>
  );
};
