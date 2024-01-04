import { Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import OPOLogoFooterFI from '#/src/assets/images/OpetushallitusIcon.svg';
import OPHIconEN from '#/src/assets/images/OPH Logo EN.png';
import OPHIcon from '#/src/assets/images/OPH logo.png';
import OPOLogoFooterEN from '#/src/assets/images/OPO_Logo_Footer_englanti.svg';
import OPOLogoFooterSV from '#/src/assets/images/OPO_Logo_Footer_ruotsi.svg';
import { colors } from '#/src/colors';
import { ImageComponent } from '#/src/components/sivu/ImageComponent';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { useContentful } from '#/src/hooks/useContentful';
import { styled, theme } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';
import { getLanguage } from '#/src/tools/localization';

const Root = styled('footer')({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(12),
  lineHeight: '21px',
  '.MuiLink-root.Mui-focusVisible': {
    outline: '1px solid black',
    outlineOffset: '4px',
  },
});

const Hr = styled('div')({
  backgroundColor: colors.white,
  width: '100%',
  overflow: 'visible',
  padding: '0',
  border: 'none',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: colors.grey500,
  textAlign: 'center',
});

const StyledIcon = styled('img')({
  height: '68px',
  top: '-24px',
  position: 'relative',
  backgroundColor: colors.white,
  padding: '0 40px 0 40px',
});

const StyledOphIcon = styled('img')({
  height: '30px',
  top: '-15px',
  position: 'relative',
  backgroundColor: colors.white,
  padding: '0 68px',
});

const overrides = {
  overrides: {
    img: {
      component: ImageComponent,
    },
    a: {
      component: Link,
      props: {
        variant: 'body2',
      },
    },
    p: {
      component: Typography,
      props: {
        variant: 'body1',
        component: 'div',
        paragraph: true,
      },
    },
  },
};

const OpintopolkuFooterLogo = () => {
  switch (getLanguage()) {
    case 'fi':
      return OPOLogoFooterFI;
    case 'en':
      return OPOLogoFooterEN;
    case 'sv':
      return OPOLogoFooterSV;
    default:
      return OPOLogoFooterFI;
  }
};

const OPHFooterLogo = () => {
  switch (getLanguage()) {
    case 'en':
      return OPHIconEN;
    default:
      return OPHIcon;
  }
};

export const Footer = () => {
  const { t } = useTranslation();
  const { data } = useContentful();

  // Footereita on vain yksi
  const { content, contentRight, contentCenter, lopputekstit } =
    getOne(data.footer) ?? {};

  return (
    <Root>
      <WithSideMargins>
        <Grid container>
          <Grid item xs={12}>
            <Hr>
              <StyledOphIcon alt={t('opintopolku.brand')} src={OpintopolkuFooterLogo()} />
            </Hr>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          paddingY={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Box m={1}>
              <Markdown options={overrides}>{content ?? ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box m={1}>
              <Markdown options={overrides}>{contentCenter ?? ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box m={1}>
              <Markdown options={overrides}>{contentRight ?? ''}</Markdown>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Hr>
              <StyledIcon alt={t('opintopolku.brand')} src={OPHFooterLogo()} />
            </Hr>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={8}>
            <Markdown options={overrides}>{lopputekstit || ''}</Markdown>
          </Grid>
        </Grid>
      </WithSideMargins>
    </Root>
  );
};
