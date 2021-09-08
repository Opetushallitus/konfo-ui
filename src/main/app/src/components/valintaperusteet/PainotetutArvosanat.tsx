import React from 'react';

import { Box, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { toId } from '#/src/tools/utils';
import { PainotettuArvosana, KoodiUrit } from '#/src/types/HakukohdeTypes';

type Props = {
  arvosanat: Array<PainotettuArvosana>;
};

const getOppiaineName = (koodiUrit: KoodiUrit) => {
  if (koodiUrit) {
    const oppiaineenNimi = localize(koodiUrit.oppiaine.nimi);
    if (!koodiUrit.kieli) {
      return oppiaineenNimi;
    } else {
      const kieliPrefix = oppiaineenNimi.match(/^[A-Z]\d/g);
      return `${kieliPrefix} ${localize(koodiUrit.kieli.nimi)}`;
    }
  }
};

export const PainotetutArvosanat = ({ arvosanat }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item container direction="column" xs={12}>
      <Grid item xs={12}>
        <Typography id={toId(t('valintaperuste.painotettavat-oppiaineet'))} variant="h2">
          {t('valintaperuste.painotettavat-oppiaineet')}
        </Typography>
        <Grid item container xs={12} md={6}>
          <Box width={'30%'}>
            <Typography id={toId(t('valintaperuste.oppiaine'))} variant="h5">
              {t('valintaperuste.oppiaine')}
            </Typography>
          </Box>
          <Box width={'30%'}>
            <Typography id={toId(t('valintaperuste.painokerroin'))} variant="h5">
              {t('valintaperuste.painokerroin')}
            </Typography>
          </Box>
        </Grid>
        {arvosanat.map((arvosana, index) => {
          return (
            <Grid key={index} item container xs={12} md={6}>
              <Box width={'30%'}>{getOppiaineName(arvosana.koodit)}</Box>
              <Box>{arvosana.painokerroin.toString().replace('.', ',')}</Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
