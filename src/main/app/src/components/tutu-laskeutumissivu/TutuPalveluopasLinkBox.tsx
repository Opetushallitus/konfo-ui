import { Box, Paper } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { OphButton, ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { LINK_PAPER_SX } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import { SectionHeading } from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { Osio } from './useTutuLaskeutumissivuData';
import { useId } from 'react';
import Markdown from 'markdown-to-jsx/react';
import { styled, theme } from '#/src/theme';
import { useTranslation } from 'react-i18next';
import { SmartLink } from '../common/SmartLink';

const StyledMarkdown = styled(Markdown)({
  marginTop: theme.spacing(1),
  lineHeight: 1.5,
  fontSize: 14,
  '& p': {
    margin: 0,
  },
  '& ul': {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  '& li': {
    paddingLeft: theme.spacing(0.5),
  },
  '& li::marker': {
    fontSize: 10,
  },
});

const StyledButton = styled(OphButton)({
  color: ophColors.cyan1,
  backgroundColor: ophColors.white,
  fontSize: 14,
  '&:hover': {
    color: ophColors.cyan1,
    backgroundColor: ophColors.white,
  },
});

const Nosto = styled(Paper)({
  backgroundColor: ophColors.cyan1,
  color: ophColors.white,
  padding: theme.spacing(2.5),
  flexWrap: 'wrap',
  ...LINK_PAPER_SX,
  flexDirection: 'row',
  gap: theme.spacing(2.5),
});

const NostoKuva = styled(Box)({
  minWidth: 'calc(min(300px, 100%))',
  flex: '1',
  objectFit: 'cover',
}) as typeof Box; // https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop

const NostoTextContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  color: 'white',
  flex: '2',
  minWidth: '50%',
  gap: theme.spacing(2),
});

const NostoTyyppi = styled(OphTypography)({
  fontSize: '9px',
  color: 'inherit',
  textTransform: 'uppercase',
  fontWeight: 700,
  letterSpacing: '1px',
  marginBottom: 1,
});

const NostoOtsikko = styled(OphTypography)({
  fontSize: '18px',
  color: 'inherit',
  fontWeight: 600,
});

export const TutuPalveluopasLinkBox = ({ osio }: { osio: Osio }) => {
  const { t } = useTranslation();
  const { nosto } = osio;
  const headingId = useId();

  return (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2" id={headingId}>
        {osio.otsikko}
      </SectionHeading>
      {nosto.href ? (
        // Koko laatikko toimii linkkinä ja klikattavana elementtinä, ei pelkästään StyledButton
        <SmartLink href={nosto.href} aria-labelledby={headingId}>
          {nosto ? (
            <Nosto>
              {nosto.kuvaUrl && <NostoKuva component="img" src={nosto.kuvaUrl} alt="" />}
              <NostoTextContainer>
                {nosto.tyyppi && <NostoTyyppi>{nosto.tyyppi}</NostoTyyppi>}
                {nosto.otsikko && (
                  <NostoOtsikko component="h3">{nosto.otsikko}</NostoOtsikko>
                )}
                {nosto.teksti && <StyledMarkdown>{nosto.teksti}</StyledMarkdown>}
                <StyledButton>
                  {t('tutu-laskeutumissivu.aloita-selvitys')}
                  <ArrowForward sx={{ marginLeft: theme.spacing(1), fontSize: 18 }} />
                </StyledButton>
              </NostoTextContainer>
            </Nosto>
          ) : null}
        </SmartLink>
      ) : null}
    </Box>
  );
};
