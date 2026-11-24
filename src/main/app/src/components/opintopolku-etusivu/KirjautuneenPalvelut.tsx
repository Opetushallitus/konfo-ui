import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import {
  EtusivuSection,
  LINK_PAPER_SX,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

export const KirjautuneenPalvelut = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    {osio.nostot.map((nosto) => (
      <Paper
        key={nosto.id}
        sx={{
          ...LINK_PAPER_SX,
          color: ophColors.grey900,
          borderTop: `4px solid ${ophColors.green2}`,
          padding: 4,
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Box component="img" src={nosto.kuvaUrl} alt="" sx={{ height: '38px' }} />
        <PaperHeading color={ophColors.green2} to={nosto.href}>
          {nosto.otsikko}
        </PaperHeading>
        <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
      </Paper>
    ))}
  </EtusivuSection>
);
