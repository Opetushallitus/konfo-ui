import React from 'react';

import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
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
import Spacer from '#/src/components/common/Spacer';
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

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'success':
      return tarjonta.hasHits ? (
        <Container maxWidth="lg" className={classes.container}>
          <Typography variant="h2">
            {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
          </Typography>
          <Spacer />
          <div style={{ position: 'relative' }}>
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
                    wrapDirection="column-reverse"
                    iconTexts={[
                      [toteutus?.locations, PublicIcon],
                      [toteutus?.opetustapa, HourglassEmptyIcon],
                      [toteutus?.price, EuroSymbolIcon],
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          <TarjontaPagination
            total={total}
            pagination={pagination}
            setPagination={setPagination}
          />
        </Container>
      ) : null;
    default:
      return null;
  }
};
