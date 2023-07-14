import React from 'react';

import { Grid, Link, Typography, useTheme } from '@mui/material';
import { size } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

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

  const [hakutulosWidth] = useHakutulosWidth();
  const isSmall = hakutulosWidth < theme.breakpoints.values['sm'];

  if (selectedTab === 'koulutus' && size(koulutusHits) > 0) {
    return (
      <>
        {koulutusHits.map((koulutus) => (
          <KoulutusKortti key={koulutus.oid} koulutus={koulutus} isSmall={isSmall} />
        ))}
      </>
    );
  }
  if (selectedTab === 'oppilaitos' && size(oppilaitosHits) > 0) {
    return (
      <>
        {oppilaitosHits.map((oppilaitos) => (
          <OppilaitosKortti
            key={oppilaitos.oid}
            oppilaitos={oppilaitos}
            isSmall={isSmall}
          />
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
        <Typography variant="h1">{t('haku.ei-hakutuloksia')}</Typography>
      </Grid>
      <Grid item>
        <Typography paragraph>{t('haku.summary', { keyword: keyword || '' })}</Typography>
      </Grid>
      <Grid item>
        <Link underline="always" variant="body1" href="/">
          {t('haku.siirry-opintopolun-etusivulle')}
        </Link>
      </Grid>
    </Grid>
  );
};
