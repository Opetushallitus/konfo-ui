import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import {
  LINK_PAPER_SX,
  PaperHeading,
  SectionHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

export const KirjautuneenPalvelut = ({ osio }: { osio: EtusivuOsio }) =>
  osio.nostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{osio.otsikko}</SectionHeading>
      {osio.nostot.map((nosto) => (
        <Paper
          key={nosto.id}
          sx={{
            ...LINK_PAPER_SX,
            color: ophColors.grey900,
            borderTop: `4px solid ${ophColors.green2}`,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}>
          <Box component="img" src={nosto.kuvaUrl} alt="" sx={{ height: '38px' }} />
          <PaperHeading color={ophColors.green2} to={nosto.href}>
            {nosto.otsikko}
          </PaperHeading>
          <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
        </Paper>
      ))}
    </Box>
  ) : null;
