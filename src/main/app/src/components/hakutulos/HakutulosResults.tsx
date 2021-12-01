import React from 'react';

import { Grid, Typography, useTheme } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';

import { KoulutusKortti } from './hakutulosKortit/KoulutusKortti';
import { OppilaitosKortti } from './hakutulosKortit/OppilaitosKortti';

type Props = {
  selectedTab: 'koulutus' | 'oppilaitos';
  koulutusHits: Array<any>;
  oppilaitosHits: Array<any>;
  keyword: string;
};

export const HakutulosResults = ({
  selectedTab,
  koulutusHits,
  oppilaitosHits,
  keyword,
}: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (selectedTab === 'koulutus' && _.size(koulutusHits) > 0) {
    return (
      <>
        {koulutusHits.map((koulutus) => (
          <KoulutusKortti key={koulutus.oid} koulutus={koulutus} />
        ))}
      </>
    );
  }
  if (selectedTab === 'oppilaitos' && _.size(oppilaitosHits) > 0) {
    return (
      <>
        {oppilaitosHits.map((oppilaitos) => (
          <OppilaitosKortti key={oppilaitos.oid} oppilaitos={oppilaitos} />
        ))}
      </>
    );
  }

  return (
    <Grid
      container
      alignItems="center"
      spacing={3}
      style={{ padding: theme.spacing(9) }}
      direction="column">
      <Grid item>
        <Typography variant="h1">{t('haku.ei-hakutuloksia', keyword)}</Typography>
      </Grid>
      <Grid item>
        <Typography paragraph>{t('haku.summary', { keyword: keyword })}</Typography>
      </Grid>
      <Grid item>
        <LocalizedLink underline="always" variant="body1" component={RouterLink} to={`/`}>
          {t('haku.siirry-opintopolun-etusivulle')}
        </LocalizedLink>
      </Grid>
    </Grid>
  );
};
