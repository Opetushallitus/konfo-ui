import React from 'react';

import { Grid, Typography, Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { educationTypeColorCode } from '#/src/colors';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';

import { usePaginatedTarjonta } from './hooks';
import { TulevaKoulutusCard } from './TulevaKoulutusCard';

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
      return isEmpty(values) ? null : (
        <PageSection
          heading={
            <Typography variant="h2" id={scrollTargetId}>
              {t('oppilaitos.tulevat-koulutukset')}
            </Typography>
          }>
          <Box position="relative" sx={{ width: '100%', maxWidth: '900px' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={1}>
              {values.map((kts) => (
                <Grid item key={kts.koulutusOid}>
                  <LocalizedLink
                    underline="none"
                    component={RouterLink}
                    to={`/koulutus/${kts.koulutusOid}`}>
                    <TulevaKoulutusCard
                      koulutusName={kts.koulutusName}
                      tutkintonimikkeet={kts.tutkintonimikkeet}
                      koulutustyypit={kts.koulutustyypit}
                      opintojenlaajuus={kts.opintojenlaajuus}
                      tyyppi={kts.tyyppi}
                    />
                  </LocalizedLink>
                </Grid>
              ))}
            </Grid>
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
