import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { toId } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type Props = {
  lisatiedot: Translateable;
};

export const Lisatiedot = ({ lisatiedot }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container direction="column" size={{ xs: 12 }}>
      <Box py={4}>
        <Divider />
      </Box>

      <HeadingBoundary>
        <Heading id={toId(t('valintaperuste.lisatiedot'))} variant="h2">
          {t('valintaperuste.lisatiedot')}
        </Heading>
        <LocalizedHTML data={lisatiedot} />
      </HeadingBoundary>
    </Grid>
  );
};
