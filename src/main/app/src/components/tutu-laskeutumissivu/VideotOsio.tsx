import { Nostot } from '../kielitutkinnot/KielitutkinnotNostoOsio';

import { Box } from '@mui/material';

import { EtusivuSection } from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

export const VideotOsio = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, 1fr)',
        },
        gap: 4,
      }}>
      <Nostot osio={osio} />
    </Box>
  </EtusivuSection>
);
