import React from 'react';

import {
  SchoolOutlined,
  TimelapseOutlined,
  ExtensionOutlined,
} from '@mui/icons-material';
import { Typography, Box } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode } from '#/src/colors';
import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
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
      return _.isEmpty(values) ? null : (
        <PageSection
          heading={
            <Typography variant="h2" id={scrollTargetId}>
              {t('oppilaitos.tulevat-koulutukset')}
            </Typography>
          }>
          <Box position="relative" sx={{ width: '100%', maxWidth: '900px' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Box flexDirection="column" alignItems="stretch">
              {values.map((kts) => (
                <Box key={kts.koulutusOid}>
                  <EntiteettiKortti
                    koulutustyyppi={kts?.tyyppi}
                    to={`/koulutus/${kts?.koulutusOid}`}
                    header={kts?.koulutusName}
                    iconTexts={[
                      [kts?.tutkintonimikkeet, SchoolOutlined],
                      [kts?.koulutustyypit, ExtensionOutlined],
                      [kts?.opintojenlaajuus, TimelapseOutlined],
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
