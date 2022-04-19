import React from 'react';

import { Box, Divider, Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
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
      <HeadingBoundary>
        <Heading id={toId(t('valintaperuste.valintatavat'))} variant="h2">
          {t('valintaperuste.valintatavat')}
        </Heading>
        <HeadingBoundary>
          {valintatavat.map(
            ({ enimmaispisteet, kynnysehto, nimi, sisalto, vahimmaispisteet }, index) => (
              <React.Fragment key={`valintatapa-${index}`}>
                <Heading variant="h3">{localize(nimi)}</Heading>
                {!_.isUndefined(vahimmaispisteet) && (
                  <Box display="flex" flexWrap="wrap" paddingBottom={1}>
                    <Box marginRight={4} flexBasis="33%">
                      <Heading variant="h5">
                        {t('valintaperuste.vahimmaispisteet')}
                      </Heading>
                      <Typography variant="body1">{vahimmaispisteet}</Typography>
                    </Box>
                    {!_.isUndefined(enimmaispisteet) && (
                      <Box>
                        <Heading variant="h5">
                          {t('valintaperuste.enimmaispisteet')}
                        </Heading>
                        <Typography variant="body1">{enimmaispisteet}</Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {!_.isEmpty(kynnysehto) && (
                  <Box py={1}>
                    <Heading variant="h5">{t('valintaperuste.kynnysehto')}</Heading>
                    <LocalizedHTML data={kynnysehto!} />
                  </Box>
                )}
                {sisalto.map(SisaltoComponent)}
              </React.Fragment>
            )
          )}
          {!_.isEmpty(hakukohteenKynnysehto) && (
            <Box py={1}>
              <Heading variant="h5">{t('valintaperuste.hakukohteenKynnysehto')}</Heading>
              <LocalizedHTML data={hakukohteenKynnysehto} />
            </Box>
          )}
        </HeadingBoundary>
      </HeadingBoundary>
    </Grid>
  );
};
