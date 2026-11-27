import { Box, Divider, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash-es';
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
  const heading = t('valintaperuste.kuvaus');

  return (
    <Grid size={{ xs: 12 }}>
      <Box py={4}>
        <Divider />
      </Box>
      <Typography id={toId(heading)} variant="h2">
        {heading}
      </Typography>
      {!isEmpty(kuvaus) && <LocalizedHTML data={kuvaus} replace={tagHeaders} />}
      {sisalto?.length > 0 && <Box>{sisalto.map(SisaltoComponent)}</Box>}
    </Grid>
  );
};
