// Uuden etusivun osioiden yhteiset osat
import { useId } from 'react';

import { Box } from '@mui/material';
import { OphTypography } from '@opetushallitus/oph-design-system';

import { SmartLink } from '#/src/components/common/SmartLink';
import { PAPER_LINK_CLASS } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
import { PageSectionHeading } from '#/src/components/PageSectionHeading';
import { ExternalLink } from '../common/ExternalLink';
import { isUndefined } from 'lodash-es';

// Etusivun osio otsikkoineen. Osiota ei näytetä, jos siinä ei ole nostoja.
// Otsikko nimeää osion, jolloin se on ruudunlukijalle nimetty alue (region-maamerkki).
export const EtusivuSection = ({
  osio,
  children,
}: {
  osio: EtusivuOsio;
  children: React.ReactNode;
}) => {
  const headingId = useId();
  return osio.nostot.length > 0 ? (
    <Box component="section" aria-labelledby={headingId} sx={{ marginTop: 6 }}>
      <PageSectionHeading component="h2" id={headingId}>
        {osio.otsikko}
      </PageSectionHeading>
      {children}
    </Box>
  ) : null;
};

const PaperHeadingContent = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to?: string;
}) => {
  const linkShouldOpenInNewTab = !to?.includes('konfo/');
  switch (true) {
    case to && linkShouldOpenInNewTab:
      return (
        <ExternalLink className={PAPER_LINK_CLASS} href={to}>
          {children}
        </ExternalLink>
      );
    case !isUndefined(to):
      return (
        <SmartLink className={PAPER_LINK_CLASS} href={to}>
          {children}
        </SmartLink>
      );
    default:
      return <>{children}</>;
  }
};

// Laatikon otsikko on laatikon ainoa linkki. Linkin ::after-elementti venytetään koko laatikon
// kokoiseksi (LINK_PAPER_SX), jolloin koko laatikko on klikattava, mutta ruudunlukija lukee
// linkin nimeksi vain otsikon.
export const PaperHeading = ({
  children,
  color = 'inherit',
  fontWeight = 600,
  fontSize = '24px',
  to,
}: {
  children: React.ReactNode;
  color?: string;
  fontWeight?: number;
  fontSize?: string;
  to?: string;
}) => {
  return (
    <OphTypography component="h3" sx={{ fontSize, color, fontWeight }}>
      <PaperHeadingContent to={to}>{children}</PaperHeadingContent>
    </OphTypography>
  );
};
