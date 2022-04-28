import React from 'react';

import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { PageSection } from '#/src/components/common/PageSection';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { OppilaitosCard } from './OppilaitosCard';

type Props = {
  jarjestajat: Array<Jarjestaja>;
};

export const TulevaJarjestajaList = ({ jarjestajat }: Props) => {
  const { t } = useTranslation();

  return (
    <PageSection heading={t('koulutus.muut-koulutusta-jarjestavat-oppilaitokset')}>
      <Grid container direction="row" justifyContent="center" spacing={2}>
        {jarjestajat.map((jarjestaja) => (
          <OppilaitosCard
            key={jarjestaja.oppilaitosOid}
            heading={localize(jarjestaja.nimi)}
            locations={localizeArrayToCommaSeparated(jarjestaja.kunnat, {
              sorted: true,
            })}
            tyyppi={jarjestaja.koulutustyyppi}
            oppilaitosOid={jarjestaja.oppilaitosOid}
            image={jarjestaja.kuva}
          />
        ))}
      </Grid>
    </PageSection>
  );
};
