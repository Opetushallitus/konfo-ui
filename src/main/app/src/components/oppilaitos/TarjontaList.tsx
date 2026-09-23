import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';
import { QueryResultWrapper } from '#/src/components/common/QueryResultWrapper';
import { RajainFiltersBar } from '#/src/components/suodattimet/RajainFiltersBar';
import { useOppilaitosTarjontaRajainOrder } from '#/src/hooks/useOppilaitosTarjontaRajainOrder';

import { usePaginatedTarjonta } from './hooks';
import { useSelectedFilters } from '../haku/hakutulosHooks';

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

const PublicIcon = createMaterialIcon('public');
const HourglassIcon = createMaterialIcon('hourglass_empty');
const EuroSymbolIcon = createMaterialIcon('euro_symbol');

export const TarjontaList = ({ oid, isOppilaitosOsa }: Props) => {
  const { t } = useTranslation();
  const {
    queryResult,
    pagination,
    setPagination,
    rajainValues = {},
    setRajainValues,
    clearRajainValues,
  } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: false,
  });

  const { data: tarjonta = {} as any, isLoading } = queryResult;
  const { values, total, rajainOptions = {} } = tarjonta;

  const allSelectedFilters = useSelectedFilters(rajainOptions, rajainValues);
  const someSelected = allSelectedFilters.flat.length > 0;
  const someValuesToShow = isLoading || values?.length > 0;

  const rajainOrder = useOppilaitosTarjontaRajainOrder({ rajainValues });

  const scrollTargetId = 'tarjonta-list';

  return (
    <PageSection
      heading={t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
      headingProps={{
        id: scrollTargetId,
      }}>
      <RajainFiltersBar
        rajainOrder={rajainOrder}
        rajainOptions={rajainOptions}
        rajainValues={rajainValues}
        setRajainValues={setRajainValues!}
        clearRajainValues={clearRajainValues!}
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
            {values?.map((toteutus: any) => (
              <Box key={toteutus?.toteutusOid}>
                <EntiteettiKortti
                  koulutustyyppi={toteutus?.tyyppi}
                  to={`/toteutus/${toteutus?.toteutusOid}`}
                  logoElement={<OppilaitosKorttiLogo image={toteutus?.kuva} alt="" />}
                  header={toteutus?.toteutusName}
                  kuvaus={toteutus?.description}
                  jarjestaaUrheilijanAmmKoulutusta={
                    toteutus?.jarjestaaUrheilijanAmmKoulutusta
                  }
                  iconTexts={[
                    [toteutus?.locations, PublicIcon],
                    [toteutus?.opetustapa, HourglassIcon],
                    [toteutus?.price, EuroSymbolIcon],
                  ]}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" paragraph>
            {t(
              someSelected
                ? 'oppilaitos.ei-rajaimia-vastaavia-toteutuksia'
                : 'oppilaitos.ei-toteutuksia'
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
  );
};
