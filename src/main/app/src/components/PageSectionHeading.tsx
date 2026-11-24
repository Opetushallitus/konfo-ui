import { OphTypography } from '@opetushallitus/oph-design-system';
import { styled } from '#/src/theme';

export const PageSectionHeading = styled(OphTypography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 400,
  lineHeight: '32px',
  marginBottom: theme.spacing(4),
}));
