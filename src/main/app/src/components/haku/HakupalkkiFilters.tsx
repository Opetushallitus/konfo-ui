import React from 'react';

import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useFilterProps, useSearch } from '#/src/components/haku/hakutulosHooks';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { FILTER_TYPES } from '#/src/constants';

import { Suodatin } from './Suodatin';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px',
  },
}));

export const HakupalkkiFilters = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      className={classes.container}>
      <Suodatin
        children={
          <KoulutustyyppiSuodatin
            values={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI)}
            muuValues={useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI_MUU)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="koulutustyyppi"
        header={t('haku.koulutustyyppi')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <OpetuskieliSuodatin
            values={useFilterProps(FILTER_TYPES.OPETUSKIELI)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="opetuskieli"
        header={t('haku.opetuskieli')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <SijaintiSuodatin
            kuntaValues={useFilterProps(FILTER_TYPES.KUNTA)}
            maakuntaValues={useFilterProps(FILTER_TYPES.MAAKUNTA)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="sijainti"
        header={t('haku.sijainti')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <PohjakoulutusvaatimusSuodatin
            values={useFilterProps(FILTER_TYPES.POHJAKOULUTUSVAATIMUS)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="pohjakoulutusvaatimus"
        header={t('haku.pohjakoulutusvaatimus')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <HakutapaSuodatin
            hakukaynnissaValues={useFilterProps(FILTER_TYPES.HAKUKAYNNISSA)}
            hakutapaValues={useFilterProps(FILTER_TYPES.HAKUTAPA)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="hakutapa"
        header={t('haku.hakutapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <ValintatapaSuodatin
            values={useFilterProps(FILTER_TYPES.VALINTATAPA)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="valintatapa"
        header={t('haku.valintatapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <KoulutusalaSuodatin
            values={useFilterProps(FILTER_TYPES.KOULUTUSALA)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="koulutusala"
        header={t('haku.koulutusalat')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        children={
          <OpetustapaSuodatin
            values={useFilterProps(FILTER_TYPES.OPETUSTAPA)}
            setFilters={setFilters}
            expanded={true}
            summaryHidden={true}
          />
        }
        id="opetustapa"
        header={t('haku.opetustapa')}
      />
    </Box>
  );
};
