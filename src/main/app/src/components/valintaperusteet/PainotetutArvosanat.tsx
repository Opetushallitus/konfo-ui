import React from 'react';

import { Box, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { toId } from '#/src/tools/utils';
import { PainotettuArvosana, KoodiUrit } from '#/src/types/HakukohdeTypes';

export const useStyles = makeStyles({
  table: {
    borderSpacing: 0,
    borderCollapse: 'separate',
  },
  cell: {
    textAlign: 'left',
    maxWidth: '200px',
    padding: '8px',
    verticalAlign: 'top',
  },
});

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
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <Box>
        <Typography
          id={toId(t('valintaperuste.painotettavat-oppiaineet'))}
          variant="h2"
          style={{ marginBottom: '8px' }}>
          {t('valintaperuste.painotettavat-oppiaineet')}
        </Typography>
        <Box>
          <table className={classes.table}>
            <tbody>
              <tr>
                <th className={classes.cell}>{t('valintaperuste.oppiaine')}</th>
                <th className={classes.cell}>{t('valintaperuste.painokerroin')}</th>
              </tr>
              {arvosanat.map((arvosana, index) => (
                <tr key={index}>
                  <td className={classes.cell}>{getOppiaineName(arvosana.koodit)}</td>
                  <td className={classes.cell}>
                    {arvosana.painokerroin.toString().replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Grid>
  );
};
