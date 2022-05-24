import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { educationTypeColorCode } from '#/src/colors';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { PageSection } from '#/src/components/common/PageSection';
import { TarjontaPagination } from '#/src/components/common/TarjontaPagination';

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
      return _.isEmpty(values) ? null : (
        <PageSection
          heading={
            <Typography variant="h2" id={scrollTargetId}>
              {t('oppilaitos.tulevat-koulutukset')}
            </Typography>
          }>
          <div style={{ position: 'relative' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={1}>
              {values.map((kts) => (
                <Grid item key={kts.koulutusOid} xs={12} md={4}>
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
          </div>
          <TarjontaPagination
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
