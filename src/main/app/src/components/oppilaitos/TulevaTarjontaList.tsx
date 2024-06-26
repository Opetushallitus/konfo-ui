import { Box } from '@mui/material';
import { isEmpty, uniqBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode } from '#/src/colors';
import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';

import { usePaginatedTarjonta } from './hooks';

type Tarjonta = {
  koulutusName: string;
  koulutusOid: string;
  koulutustyypit: string;
  opintojenlaajuus: string;
  tutkintonimikkeet: string;
  tyyppi: keyof typeof educationTypeColorCode;
};

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

const SchoolIcon = createMaterialIcon('school', 'outlined');
const ExtensionIcon = createMaterialIcon('extension', 'outlined');
const TimelapseIcon = createMaterialIcon('timelapse', 'outlined');

export const TulevaTarjontaList = ({ oid, isOppilaitosOsa }: Props) => {
  const { t } = useTranslation();

  const { queryResult, pagination, setPagination } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: true,
  });

  const { data: tulevaTarjonta = {}, isFetching, status } = queryResult;
  const { values, total } = tulevaTarjonta as {
    values: Array<Tarjonta>;
    total: number;
  };

  const scrollTargetId = 'tuleva-tarjonta-list';

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'success':
      return isEmpty(values) ? null : (
        <PageSection
          heading={t('oppilaitos.tulevat-koulutukset')}
          headingProps={{
            id: scrollTargetId,
          }}>
          <Box position="relative" sx={{ width: '100%', maxWidth: '900px' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Box flexDirection="column" alignItems="stretch">
              {uniqBy(values, 'koulutusOid').map((kts) => (
                <Box key={kts.koulutusOid}>
                  <EntiteettiKortti
                    koulutustyyppi={kts?.tyyppi}
                    to={`/koulutus/${kts?.koulutusOid}`}
                    header={kts?.koulutusName}
                    iconTexts={[
                      [kts?.tutkintonimikkeet, SchoolIcon],
                      [kts?.koulutustyypit, ExtensionIcon],
                      [kts?.opintojenlaajuus, TimelapseIcon],
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
            scrollTargetId={scrollTargetId}
          />
        </PageSection>
      );
    default:
      return null;
  }
};
