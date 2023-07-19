import React from 'react';

import { Box, Divider, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { toId } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

import { SisaltoComponent } from './Sisalto';
import { tagHeaders } from './tagHeaders';
import { Sisalto } from './ValintaperusteTypes';

type Props = {
  kuvaus: Translateable;
  sisalto: Sisalto;
};

export const Kuvaus = ({ kuvaus, sisalto = [] }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      {!isEmpty(kuvaus) && (
        <Box>
          <Typography id={toId(t('valintaperuste.kuvaus'))} variant="h2">
            {t('valintaperuste.kuvaus')}
          </Typography>
          <LocalizedHTML data={kuvaus} transform={tagHeaders} />
        </Box>
      )}
      {sisalto?.length > 0 && <Box>{sisalto.map(SisaltoComponent)}</Box>}
    </Grid>
  );
};
