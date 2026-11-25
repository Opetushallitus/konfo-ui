// Uuden etusivun osioiden yhteiset osat
import { useId } from 'react';

import { Box } from '@mui/material';
import { OphTypography } from '@opetushallitus/oph-design-system';

import { SmartLink } from '#/src/components/common/SmartLink';
import { PAPER_LINK_CLASS } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
import { PageSectionHeading } from '#/src/components/PageSectionHeading';
import { ExternalLink } from '../common/ExternalLink';
import { isString, isUndefined } from 'lodash-es';

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

const parseValidExternalURL = (to?: string): URL | undefined => {
  if (to) {
    try {
      return new URL(to);
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  }
};

const otsikkoWithExternalDomain = (
  linkShouldOpenInNewTab?: boolean,
  otsikko?: string,
  to?: URL | string
): string => {
  const domain =
    !isString(to) && linkShouldOpenInNewTab
      ? to?.hostname?.replace('www.', '')
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
  const parsedURL = parseValidExternalURL(to);
  // Linkki on konfo-linkki, jos se sisältää sanan konfo ja se ei ole ns. ulkoinen linkki, joka sisältää sanan konfo eli sitä ei pystytä parsimaan URLiksi
  const isKonfoLink = to?.includes('konfo') && !parsedURL;
  const validURL = isKonfoLink ? to : parseValidExternalURL(to);
  return (
    <OphTypography component="h3" sx={{ fontSize, color, fontWeight }}>
      <PaperHeadingContent
        to={validURL && validURL.toString()}
        linkShouldOpenInNewTab={!isKonfoLink}>
        {otsikkoWithExternalDomain(!isKonfoLink, otsikko, validURL)}
      </PaperHeadingContent>
    </OphTypography>
  );
};
