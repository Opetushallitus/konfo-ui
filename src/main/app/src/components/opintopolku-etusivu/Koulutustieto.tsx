import { Box, Paper } from '@mui/material';
import { OphButton, ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { InlineSvgIcon } from '#/src/components/common/InlineSvgIcon';
import { LINK_PAPER_SX } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import {
  EtusivuSection,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { EtusivuOsio } from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';
import { SmartLink } from '../common/SmartLink';
import { Stack } from '@mui/system';

const LinkButton = ({
  color,
  href,
  variant,
  children,
}: {
  color: keyof typeof ophColors;
  href?: string;
  variant?: 'text' | 'outlined' | 'contained';
  children: React.ReactNode;
}) => {
  return (
    <OphButton
      href={href}
      component={SmartLink}
      variant={variant}
      // Teeman painikkeet vaihtavat tekstin ja reunan väriä hover- ja active-tiloissa, joten
      // valkoinen väri asetetaan myös niihin
      sx={{
        '&, &:hover, &:active': {
          color: ophColors.white,
        },
        '&.MuiButton-text': {
          paddingLeft: 0,
          paddingRight: 0,
        },
        '&.MuiButton-text:hover, &.MuiButton-text:active': {
          textDecoration: 'underline',
        },
        // Teeman outlined-painikkeella on valkoinen tausta, jolloin valkoinen teksti ei näkyisi
        '&.MuiButton-outlined': {
          backgroundColor: 'transparent',
          border: `1px solid ${ophColors.white}`,
        },
        // Paksumpi reuna oph-design-systemin tapaan (vrt. sen focusOutlineStyle, jota ei ole
        // exportattu) outlinena: 2px outline piirretään reunan päälle painikkeen sisäpuolelle,
        // jolloin painikkeen koko ei muutu
        '&.MuiButton-outlined:hover, &.MuiButton-outlined:active': {
          outline: `2px solid ${ophColors.white}`,
          outlineOffset: '-2px',
        },

        // Teeman outlined-painikkeella on valkoinen tausta, jolloin valkoinen teksti ei näkyisi
        '&.MuiButton-contained': {
          backgroundColor: ophColors.white,
          color: ophColors[color],
        },
        // Paksumpi reuna oph-design-systemin tapaan (vrt. sen focusOutlineStyle, jota ei ole
        // exportattu) outlinena: 2px outline piirretään reunan päälle painikkeen sisäpuolelle,
        // jolloin painikkeen koko ei muutu
        '&.MuiButton-contained:hover, &.MuiButton-contained:active': {
          backgroundColor: ophColors.white,
        },
      }}>
      {children}
    </OphButton>
  );
};

export const Koulutustieto = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 4,
      }}>
      {osio.nostot.map((nosto, index) => {
        const singleNostoLink = nosto?.linkit?.length === 1 ? nosto.linkit[0] : undefined;
        const nostoColor = nosto.color ?? 'green2';

        const isFirst = index === 0;
        // Ensimmäisen jälkeen laatikot ovat kahdessa sarakkeessa, joten parittomalla indeksillä
        // oleva viimeinen laatikko jäisi rivilleen yksin
        const isLastAlone = index === osio.nostot.length - 1 && index % 2 === 1;
        return (
          <Paper
            key={nosto.id}
            sx={{
              // Ensimmäinen ja rivilleen yksin jäävä viimeinen laatikko koko rivin levyisenä
              gridColumn: isFirst || isLastAlone ? '1 / -1' : undefined,
              backgroundColor: ophColors[nostoColor],
              color: 'white',
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              ...LINK_PAPER_SX,
            }}>
            {/* SVG upotetaan sivulle (kuten MaterialIcon), jolloin se saa tekstin värin (currentColor).
                Koristekuva: otsikko kertoo jo sisällön. */}
            {nosto.kuvaUrl && (
              <InlineSvgIcon src={nosto.kuvaUrl} aria-hidden sx={{ fontSize: '64px' }} />
            )}
            <PaperHeading to={singleNostoLink?.href}>{nosto.otsikko}</PaperHeading>
            <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
            {!singleNostoLink && (
              <Stack
                direction="row"
                gap={2}
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  '& > *': {
                    flex: '1 1 0',
                    minWidth: 'min-content',
                    maxWidth: 'max-content',
                  },
                }}>
                {nosto.linkit?.map((link) => (
                  <LinkButton
                    key={link.id}
                    href={link.href}
                    variant={link.variant}
                    color={nostoColor}>
                    {link.teksti}
                  </LinkButton>
                ))}
              </Stack>
            )}
          </Paper>
        );
      })}
    </Box>
  </EtusivuSection>
);
