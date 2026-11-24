// Uuden etusivun osioiden yhteiset osat
import { OphTypography } from '@opetushallitus/oph-design-system';

import { styled } from '#/src/theme';

export const SectionHeading = styled(OphTypography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 400,
  marginBottom: theme.spacing(4),
}));

export const PaperHeading = ({
  children,
  color,
  fontWeight = 600,
}: {
  children: React.ReactNode;
  color: string;
  fontWeight?: number;
}) => (
  <OphTypography component="h3" sx={{ fontSize: '24px', color, fontWeight }}>
    {children}
  </OphTypography>
);

// Linkkinä toimivien laatikoiden yhteinen tyyli: ei linkin alleviivausta koko laatikolle, vaan
// otsikko alleviivataan, kun laatikon päällä on hiiri tai näppäimistön kohdistus
export const LINK_PAPER_SX = {
  textDecoration: 'none',
  '&:hover h3, &:focus-visible h3': {
    textDecoration: 'underline',
  },
};
