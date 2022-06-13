import React from 'react';

import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { KoulutusalaSuodatin } from '#/src/components/haku/hakutulos/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/haku/hakutulos/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/haku/hakutulos/hakutulosSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/haku/hakutulos/hakutulosSuodattimet/SijaintiSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/OpetusKieliSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/ValintatapaSuodatin';

import { Suodatin } from './Suodatin';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px',
  },
}));

export const HakupalkkiFilters = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      className={classes.container}>
      <Suodatin
        SuodatinComponent={KoulutustyyppiSuodatin}
        id="koulutustyyppi"
        header={t('haku.koulutustyyppi')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={OpetuskieliSuodatin}
        id="opetuskieli"
        header={t('haku.opetuskieli')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={SijaintiSuodatin}
        id="sijainti"
        header={t('haku.sijainti')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={PohjakoulutusvaatimusSuodatin}
        id="pohjakoulutusvaatimus"
        header={t('haku.pohjakoulutusvaatimus')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={HakutapaSuodatin}
        id="hakutapa"
        header={t('haku.hakutapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={ValintatapaSuodatin}
        id="valintatapa"
        header={t('haku.valintatapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={KoulutusalaSuodatin}
        id="koulutusala"
        header={t('haku.koulutusalat')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={OpetustapaSuodatin}
        id="opetustapa"
        header={t('haku.opetustapa')}
      />
    </Box>
  );
};
