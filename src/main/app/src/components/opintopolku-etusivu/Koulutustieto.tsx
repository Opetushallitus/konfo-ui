import { Box, Paper, SxProps, Theme } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { InlineSvgIcon } from '#/src/components/common/InlineSvgIcon';
import {
  LINK_PAPER_SX,
  PaperHeading,
  SectionHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

const KoulutustietoPaper = ({
  icon,
  heading,
  text,
  to,
  backgroundColor,
  sx,
}: {
  icon?: string;
  heading: string;
  text?: string;
  backgroundColor: string;
  to?: string;
  sx?: SxProps<Theme>;
}) => (
  <Paper
    elevation={0}
    sx={[
      {
        backgroundColor,
        color: 'white',
        ...LINK_PAPER_SX,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}>
    {/* SVG upotetaan sivulle (kuten MaterialIcon), jolloin se saa tekstin värin (currentColor).
        Koristekuva: otsikko kertoo jo sisällön. */}
    {icon && <InlineSvgIcon src={icon} aria-hidden sx={{ fontSize: '64px' }} />}
    <PaperHeading color="inherit" to={to}>
      {heading}
    </PaperHeading>
    <OphTypography sx={{ color: 'inherit' }}>{text}</OphTypography>
  </Paper>
);

export const Koulutustieto = ({ osio }: { osio: EtusivuOsio }) =>
  osio.nostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{osio.otsikko}</SectionHeading>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 4,
        }}>
        {osio.nostot.map((nosto, index) => (
          <KoulutustietoPaper
            key={nosto.id}
            icon={nosto.kuvaUrl}
            heading={nosto.otsikko}
            text={nosto.teksti}
            backgroundColor={index === 0 ? ophColors.cyan1 : ophColors.green2}
            to={nosto.href}
            sx={index === 0 ? { gridColumn: '1 / -1' } : undefined}
          />
        ))}
      </Box>
    </Box>
  ) : null;
