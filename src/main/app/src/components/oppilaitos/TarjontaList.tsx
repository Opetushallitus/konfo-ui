import React from 'react';

import { Typography, Grid, makeStyles, Box } from '@material-ui/core';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PublicIcon from '@material-ui/icons/Public';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import {
  LoadingCircle,
  OverlayLoadingCircle,
} from '#/src/components/common/LoadingCircle';
import { PageSection } from '#/src/components/common/PageSection';
import { TarjontaPagination } from '#/src/components/common/TarjontaPagination';

import { usePaginatedTarjonta } from './hooks';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
  grid: {
    maxWidth: '900px',
  },
});

type Props = {
  oid: string;
  isOppilaitosOsa: boolean;
};

export const TarjontaList = ({ oid, isOppilaitosOsa }: Props) => {
  const classes = useStyles();
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
          heading={
            <Typography variant="h2" id={scrolltargetId}>
              {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
            </Typography>
          }>
          <TarjontaPagination
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
                    logoElement={
                      <OppilaitosKorttiLogo
                        image={toteutus?.kuva}
                        alt={`${toteutus?.toteutusName} ${t(
                          'koulutus.koulutuksen-teemakuva'
                        )}`}
                      />
                    }
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
          <TarjontaPagination
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
