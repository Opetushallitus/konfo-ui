import React from 'react';

import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Spacer from '#/src/components/common/Spacer';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { OppilaitosCard } from './OppilaitosCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

type Props = {
  jarjestajat: Array<Jarjestaja>;
};

export const TulevaJarjestajaList = ({ jarjestajat }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h3">
        {t('koulutus.muut-koulutusta-jarjestavat-oppilaitokset')}
      </Typography>
      <Spacer />
      <Grid container direction="row" justifyContent="center" spacing={2}>
        {jarjestajat.map((jarjestaja) => (
          <OppilaitosCard
            key={jarjestaja.oppilaitosOid}
            heading={localize(jarjestaja.nimi)}
            locations={localizeArrayToCommaSeparated(jarjestaja.kunnat, { sorted: true })}
            tyyppi={jarjestaja.koulutustyyppi}
            oppilaitosOid={jarjestaja.oppilaitosOid}
            image={jarjestaja.kuva}
          />
        ))}
      </Grid>
    </Container>
  );
};
