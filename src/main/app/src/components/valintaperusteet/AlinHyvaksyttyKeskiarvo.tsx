import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { formatDouble, toId } from '#/src/tools/utils';

type Props = {
  alinHyvaksyttyKeskiarvo: number;
};

export const AlinHyvaksyttyKeskiarvo = ({ alinHyvaksyttyKeskiarvo }: Props) => {
  const { t } = useTranslation();

  const alinHyvaksyttyKeskiarvoFormatted = formatDouble(alinHyvaksyttyKeskiarvo, 2);

  return (
    <Grid size={{ xs: 12 }}>
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
          {alinHyvaksyttyKeskiarvoFormatted}
        </Box>
      </HeadingBoundary>
    </Grid>
  );
};
