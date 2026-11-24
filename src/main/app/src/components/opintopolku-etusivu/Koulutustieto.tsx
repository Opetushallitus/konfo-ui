import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { InlineSvgIcon } from '#/src/components/common/InlineSvgIcon';
import {
  EtusivuSection,
  LINK_PAPER_SX,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

export const Koulutustieto = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 4,
      }}>
      {osio.nostot.map((nosto, index) => {
        const isFirst = index === 0;
        return (
          <Paper
            key={nosto.id}
            sx={{
              // Ensimmäinen laatikko koko rivin levyisenä
              gridColumn: isFirst ? '1 / -1' : undefined,
              backgroundColor: isFirst ? ophColors.green2 : ophColors.cyan1,
              color: 'white',
              ...LINK_PAPER_SX,
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            {/* SVG upotetaan sivulle (kuten MaterialIcon), jolloin se saa tekstin värin (currentColor).
                Koristekuva: otsikko kertoo jo sisällön. */}
            {nosto.kuvaUrl && (
              <InlineSvgIcon src={nosto.kuvaUrl} aria-hidden sx={{ fontSize: '64px' }} />
            )}
            <PaperHeading to={nosto.href}>{nosto.otsikko}</PaperHeading>
            <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
          </Paper>
        );
      })}
    </Box>
  </EtusivuSection>
);
