import React from 'react';

import { Box, Divider, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { toId } from '#/src/tools/utils';

type Props = {
  alinHyvaksyttyKeskiarvo: number;
};

export const AlinHyvaksyttyKeskiarvo = ({ alinHyvaksyttyKeskiarvo }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>

      <HeadingBoundary>
        <Heading
          id={toId(t('toteutus.alin-hyvaksytty-keskiarvo'))}
          style={{ marginBottom: '8px' }}
          variant="h2">
          {t('toteutus.alin-hyvaksytty-keskiarvo')}
        </Heading>
        <Box>
          {`${t('valintaperuste.keskiarvo')}: `}
          {alinHyvaksyttyKeskiarvo}
        </Box>
      </HeadingBoundary>
    </Grid>
  );
};
