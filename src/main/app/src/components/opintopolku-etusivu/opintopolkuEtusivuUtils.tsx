// Uuden etusivun osioiden yhteiset osat
import { Box } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { SmartLink } from '#/src/components/common/SmartLink';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
import { styled } from '#/src/theme';

export const SectionHeading = styled(OphTypography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 400,
  marginBottom: theme.spacing(4),
}));

// Etusivun osio otsikkoineen. Osiota ei näytetä, jos siinä ei ole nostoja.
export const EtusivuSection = ({
  osio,
  children,
}: {
  osio: EtusivuOsio;
  children: React.ReactNode;
}) =>
  osio.nostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{osio.otsikko}</SectionHeading>
      {children}
    </Box>
  ) : null;

const PAPER_LINK_CLASS = 'paper-link';

// Laatikon otsikko on laatikon ainoa linkki. Linkin ::after-elementti venytetään koko laatikon
// kokoiseksi (LINK_PAPER_SX), jolloin koko laatikko on klikattava, mutta ruudunlukija lukee
// linkin nimeksi vain otsikon.
export const PaperHeading = ({
  children,
  color,
  fontWeight = 600,
  to,
}: {
  children: React.ReactNode;
  color: string;
  fontWeight?: number;
  to?: string;
}) => (
  <OphTypography component="h3" sx={{ fontSize: '24px', color, fontWeight }}>
    <SmartLink className={PAPER_LINK_CLASS} href={to}>
      {children}
    </SmartLink>
  </OphTypography>
);

// Linkkinä toimivien laatikoiden yhteinen tyyli. Sisältö allekkain. Hiiri- ja kohdistustyylit ovat
// laatikossa: otsikko alleviivataan, kun laatikon päällä on hiiri, ja näppäimistön kohdistus
// näytetään koko laatikon ympärillä.
export const LINK_PAPER_SX = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  [`& .${PAPER_LINK_CLASS}`]: {
    color: 'inherit',
    textDecoration: 'none',
    outline: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
    },
  },
  boxShadow: '2px 2px 8px 0px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    boxShadow: '3px 3px 12px 0px rgba(0, 0, 0, 0.25)',
  },
  [`&:hover .${PAPER_LINK_CLASS}, & .${PAPER_LINK_CLASS}:focus-visible`]: {
    textDecoration: 'underline',
  },
  [`&:has(.${PAPER_LINK_CLASS}:focus-visible)`]: {
    outline: `2px solid ${ophColors.black}`,
    outlineOffset: '2px',
  },
} as const;
