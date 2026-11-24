import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LINK_PAPER_SX } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import {
  EtusivuSection,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

// YKI-testiin osallistuminen -osio: laatikoissa kuva ylhäällä, sen alla vihreä otsikko, pieni teksti
// ja nuoli. Isoilla näytöillä neljä laatikkoa rinnakkain.
export const YkiTestiinOsallistuminen = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 4,
      }}>
      {osio.nostot.map((nosto) => (
        <Paper
          key={nosto.id}
          sx={{
            ...LINK_PAPER_SX,
            color: ophColors.grey900,
            overflow: 'hidden',
            gap: 0,
            '&:hover': {
              '.arrow_icon': {
                color: ophColors.green2,
              },
            },
          }}>
          {nosto.kuvaUrl && (
            <Box
              component="img"
              src={nosto.kuvaUrl}
              alt=""
              sx={{ width: '100%', objectFit: 'cover' }}
            />
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              flexGrow: 1,
              padding: 2,
            }}>
            <PaperHeading
              color={ophColors.green2}
              fontSize="20px"
              fontWeight={400}
              to={nosto.linkit?.[0]?.href}>
              {nosto.otsikko}
            </PaperHeading>
            <OphTypography variant="body2" sx={{ color: 'inherit', flexGrow: 1 }}>
              {nosto.teksti}
            </OphTypography>
            <MaterialIcon
              icon="arrow_forward"
              aria-hidden
              className="arrow_icon"
              sx={{ color: ophColors.grey400, alignSelf: 'flex-start' }}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  </EtusivuSection>
);
