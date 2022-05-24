import React from 'react';

import { Grid, Typography, useTheme } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useWindowSize } from 'react-use';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useSideMenu } from '#/src/hooks';

import { KoulutusKortti } from './hakutulosKortit/KoulutusKortti';
import { OppilaitosKortti } from './hakutulosKortit/OppilaitosKortti';
import { useSuodatinpalkkiWidth } from './Suodatinpalkki';

type Props = {
  selectedTab: 'koulutus' | 'oppilaitos';
  koulutusHits: Array<any>;
  oppilaitosHits: Array<any>;
  keyword: string;
};

const useHakutulosWidth = () => {
  const { width: sideMenuWidth } = useSideMenu();
  const { width: windowWidth } = useWindowSize();
  const suodatinpalkkiWidth = useSuodatinpalkkiWidth();

  return windowWidth - sideMenuWidth - suodatinpalkkiWidth;
};

export const HakutulosResults = ({
  selectedTab,
  koulutusHits,
  oppilaitosHits,
  keyword,
}: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const hakutulosWidth = useHakutulosWidth();
  const isSmall = hakutulosWidth < theme.breakpoints.values['sm'];

  if (selectedTab === 'koulutus' && _.size(koulutusHits) > 0) {
    return (
      <>
        {koulutusHits.map((koulutus) => (
          <KoulutusKortti key={koulutus.oid} koulutus={koulutus} isSmall={isSmall} />
        ))}
      </>
    );
  }
  if (selectedTab === 'oppilaitos' && _.size(oppilaitosHits) > 0) {
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
        <Typography paragraph>{t('haku.summary', { keyword })}</Typography>
      </Grid>
      <Grid item>
        <LocalizedLink underline="always" variant="body1" component={RouterLink} to="/">
          {t('haku.siirry-opintopolun-etusivulle')}
        </LocalizedLink>
      </Grid>
    </Grid>
  );
};
