// Uuden etusivun osioiden yhteiset osat
import { useId } from 'react';

import { Box } from '@mui/material';
import { OphLink, OphTypography } from '@opetushallitus/oph-design-system';

import { SmartLink } from '#/src/components/common/SmartLink';
import { PAPER_LINK_CLASS } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
import { PageSectionHeading } from '#/src/components/PageSectionHeading';

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
  linkShouldOpenInNewTab,
}: {
  children: React.ReactNode;
  to?: string;
  linkShouldOpenInNewTab?: boolean;
}) => {
  const target = linkShouldOpenInNewTab ? '_blank' : '';
  return (
    <>
      {to ? (
        <OphLink
          component={SmartLink}
          className={PAPER_LINK_CLASS}
          href={to}
          target={target}
          variant="body1">
          {children}
        </OphLink>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

const parseExternalURL = (to?: string): URL | undefined => {
  if (to) {
    try {
      return new URL(to);
    } catch (error) {
      console.debug(error);
      return undefined;
    }
  }
};

const otsikkoWithExternalDomain = (
  linkShouldOpenInNewTab?: boolean,
  otsikko?: string,
  to?: string
): string => {
  const parsedURL = parseExternalURL(to);

  const domain =
    parsedURL && linkShouldOpenInNewTab
      ? parsedURL?.hostname?.replace('www.', '')
      : undefined;

  const domainStr = domain ? ` (${domain})` : '';
  return `${otsikko ?? ''}${domainStr}`;
};

// Laatikon otsikko on laatikon ainoa linkki. Linkin ::after-elementti venytetään koko laatikon
// kokoiseksi (LINK_PAPER_SX), jolloin koko laatikko on klikattava, mutta ruudunlukija lukee
// linkin nimeksi vain otsikon.
export const PaperHeading = ({
  color = 'inherit',
  fontWeight = 600,
  fontSize = '24px',
  to,
  otsikko,
}: {
  color?: string;
  fontWeight?: number;
  fontSize?: string;
  to?: string;
  otsikko?: string;
}) => {
  const isKonfoLink = to?.includes('/konfo');
  return (
    <OphTypography component="h3" sx={{ fontSize, color, fontWeight }}>
      <PaperHeadingContent to={to} linkShouldOpenInNewTab={!isKonfoLink}>
        {otsikkoWithExternalDomain(!isKonfoLink, otsikko, to)}
      </PaperHeadingContent>
    </OphTypography>
  );
};

export const OPINTOPOLKU_ETUSIVU_MAX_WIDTH = 1440;
