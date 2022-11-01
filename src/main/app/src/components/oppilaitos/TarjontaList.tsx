import React from 'react';

import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PublicIcon from '@mui/icons-material/Public';
import { Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { PageSection } from '#/src/components/common/PageSection';
import { Pagination } from '#/src/components/common/Pagination';

import { usePaginatedTarjonta } from './hooks';

const PREFIX = 'TarjontaList';

const classes = {
  container: `${PREFIX}-container`,
  grid: `${PREFIX}-grid`,
};

const StyledPageSection = styled(PageSection)({
  [`& .${classes.container}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
  [`& .${classes.grid}`]: {
    maxWidth: '900px',
  },
});

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

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
        <StyledPageSection
          heading={
            <Typography variant="h2" id={scrolltargetId}>
              {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
            </Typography>
          }>
          <Pagination
            total={total}
            pagination={pagination}
            setPagination={setPagination}
          />
          <Box position="relative">
            <OverlayLoadingCircle isLoading={isFetching} />
            <Grid container className={classes.grid} direction="column" spacing={1}>
              {values?.map((toteutus: any) => (
                <Grid item key={toteutus?.toteutusOid}>
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
                      [toteutus?.opetustapa, HourglassEmptyIcon],
                      [toteutus?.price, EuroSymbolIcon],
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Pagination
            total={total}
            pagination={pagination}
            setPagination={setPagination}
            scrollTargetId={scrolltargetId}
          />
        </StyledPageSection>
      ) : null;
    default:
      return null;
  }
};
