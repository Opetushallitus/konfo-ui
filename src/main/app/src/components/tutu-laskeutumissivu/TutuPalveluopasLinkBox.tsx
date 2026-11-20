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
  backgroundColor: 'white',
  fontSize: 14,
  '&:hover': {
    color: ophColors.cyan1,
    backgroundColor: 'white',
  },
});

const Nosto = styled(Paper)({
  backgroundColor: ophColors.cyan1,
  color: 'white',
  ...LINK_PAPER_SX,
  padding: theme.spacing(2.5),
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  gap: theme.spacing(2.5),
});

const NostoKuva = styled(Box)({
  minWidth: 'calc(min(300px, 100%))',
  flex: '1',
  objectFit: 'cover',
}) as typeof Box; // https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop

const NostoTextContainer = styled(Box)({
  color: 'white',
  flex: '2',
  minWidth: '50%',
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
  marginBottom: 2,
});

export const TutuPalveluopasLinkBox = ({ osio }: { osio: Osio }) => {
  const { t } = useTranslation();
  const { nosto } = osio;
  const headingId = useId();

  return (
    // Koko laatikko toimii linkkinä ja klikattavana elementtinä, ei pelkästään StyledButton
    <>
      {nosto.href ? (
        <SmartLink href={nosto.href}>
          <Box component="section" aria-labelledby={headingId} sx={{ marginTop: 6 }}>
            <SectionHeading component="h2" id={headingId}>
              {osio.otsikko}
            </SectionHeading>
            {nosto ? (
              <Nosto key={nosto.id}>
                {nosto.kuvaUrl && (
                  <NostoKuva component="img" src={nosto.kuvaUrl} alt="" />
                )}
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
          </Box>
        </SmartLink>
      ) : null}
    </>
  );
};
