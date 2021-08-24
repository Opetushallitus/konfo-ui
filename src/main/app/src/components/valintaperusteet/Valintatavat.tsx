import React from 'react';

import { Box, Divider, Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { localize } from '#/src/tools/localization';
import { toId } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

import { SisaltoComponent } from './Sisalto';
import { Valintatapa } from './ValintaperusteTypes';

type Props = { hakukohteenKynnysehto: Translateable; valintatavat: Array<Valintatapa> };

export const Valintatavat = ({ hakukohteenKynnysehto, valintatavat = [] }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <Typography id={toId(t('valintaperuste.valintatavat'))} variant="h2">
        {t('valintaperuste.valintatavat')}
      </Typography>
      {valintatavat.map(
        ({ enimmaispisteet, kynnysehto, nimi, sisalto, vahimmaispisteet }, index) => (
          <React.Fragment key={`valintatapa-${index}`}>
            <Box py={3}>
              <Typography variant="h3">{localize(nimi)}</Typography>
            </Box>
            {vahimmaispisteet && (
              <Box display="flex" paddingBottom={1}>
                <Box marginRight={4} flexBasis="33%">
                  <Typography variant="h5">
                    {t('valintaperuste.vahimmaispisteet')}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {vahimmaispisteet}
                  </Typography>
                </Box>
                {enimmaispisteet && (
                  <Box flexBasis="67%">
                    <Typography variant="h5">
                      {t('valintaperuste.enimmaispisteet')}
                    </Typography>
                    <Typography variant="body1" component="div">
                      {enimmaispisteet}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            {!_.isEmpty(kynnysehto) && (
              <Box py={1}>
                <Typography variant="h5">{t('valintaperuste.kynnysehto')}</Typography>
                <LocalizedHTML data={kynnysehto!} />
              </Box>
            )}
            {sisalto.map(SisaltoComponent)}
          </React.Fragment>
        )
      )}
      {!_.isEmpty(hakukohteenKynnysehto) && (
        <Box py={1}>
          <Typography variant="h5">
            {t('valintaperuste.hakukohteenKynnysehto')}
          </Typography>
          <LocalizedHTML data={hakukohteenKynnysehto} />
        </Box>
      )}
    </Grid>
  );
};
