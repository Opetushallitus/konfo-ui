import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';

import { usePaginatedTarjonta } from './hooks';

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

const PublicIcon = createMaterialIcon('public');
const HourglassIcon = createMaterialIcon('hourglass_empty');
const EuroSymbolIcon = createMaterialIcon('euro_symbol');

export const TarjontaList = ({ oid, isOppilaitosOsa }: Props) => {
  const { t } = useTranslation();
  const { queryResult, pagination, setPagination } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: false,
  });

  const { data: tarjonta = {} as any, status, isFetching } = queryResult;
  const { values, total } = tarjonta;

  const scrolltargetId = 'tarjonta-list';

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'success':
      return tarjonta.hasHits ? (
        <PageSection
          heading={t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
          headingProps={{
            id: scrolltargetId,
          }}>
          <Pagination
            total={total}
            pagination={pagination}
            setPagination={setPagination}
          />
          <Box position="relative" sx={{ width: '100%', maxWidth: '900px' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Box flexDirection="column" alignItems="stretch">
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
          </Box>
          <Pagination
            total={total}
            pagination={pagination}
            setPagination={setPagination}
            scrollTargetId={scrolltargetId}
          />
        </PageSection>
      ) : null;
    default:
      return null;
  }
};
