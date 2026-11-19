import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import {
  LINK_PAPER_SX,
  PaperHeading,
  SectionHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

// Muut palvelut -osio: kuusi valkoista laatikkoa, isoilla näytöillä kolme rivissä. Kuvake otsikon
// vasemmalla puolella ja sisältö tasattu vasemmalle.
const MUUT_PALVELUT_MIN_WIDTH = '300px';

export const MuutPalvelut = ({ osio }: { osio: EtusivuOsio }) =>
  osio.nostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{osio.otsikko}</SectionHeading>
      <Box
        sx={{
          display: 'grid',
          // Laatikot rivittyvät käytettävissä olevan leveyden mukaan: jokainen vähintään
          // MUUT_PALVELUT_MIN_WIDTH levyinen (tai koko leveys, jos tilaa on vähemmän) ja enintään
          // kolme rivissä (1/3 leveydestä kahden 32px välin jälkeen)
          gridTemplateColumns: `repeat(auto-fill, minmax(max(min(100%, ${MUUT_PALVELUT_MIN_WIDTH}), calc((100% - 64px) / 3)), 1fr))`,
          gap: 4,
        }}>
        {osio.nostot.map((nosto) => {
          return (
            <Paper
              key={nosto.id}
              sx={{
                color: ophColors.grey900,
                ...LINK_PAPER_SX,
                borderRadius: '10px',
                paddingX: 2.5,
                paddingY: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                gap: 2,
              }}>
              <MaterialIcon
                icon="arrow_forward"
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: 30,
                  right: 16,
                  color: ophColors.grey500,
                }}
              />
              {/* Oikea reunus jättää tilaa nuolelle */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingRight: 4 }}>
                <Box component="img" src={nosto.kuvaUrl} alt="" sx={{ height: '40px' }} />
                <PaperHeading color="inherit" fontWeight={400} to={nosto.href}>
                  {nosto.otsikko}
                </PaperHeading>
              </Box>
              <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
            </Paper>
          );
        })}
      </Box>
    </Box>
  ) : null;
