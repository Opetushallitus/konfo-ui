import React from 'react';

import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { KoulutusalaSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';

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
