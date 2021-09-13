import React from 'react';

import { Box, Divider, Grid, Typography } from '@material-ui/core';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { toId } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

import { SisaltoComponent, tagHeaders } from './Sisalto';
import { Sisalto } from './ValintaperusteTypes';

type Props = {
  kuvaus: Translateable;
  sisalto: Sisalto;
};

export const Kuvaus = ({ kuvaus, sisalto = [] }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item container xs={12}>
      <Box py={4} width="100%">
        <Divider />
      </Box>
      {!_fp.isEmpty(kuvaus) && (
        <Grid item xs={12}>
          <Typography id={toId(t('valintaperuste.kuvaus'))} variant="h2">
            {t('valintaperuste.kuvaus')}
          </Typography>
          <LocalizedHTML data={kuvaus} transform={tagHeaders} />
        </Grid>
      )}
      {sisalto?.length > 0 && (
        <Grid item xs={12}>
          {sisalto.map(SisaltoComponent)}
        </Grid>
      )}
    </Grid>
  );
};
