import React from 'react';

import {
  Button,
  Typography,
  ButtonGroup,
  Drawer,
  Grid,
  Link,
  Container,
  Hidden,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useContentful } from '#/src/hooks/useContentful';
import { useCookieConsentState } from '#/src/hooks/useCookieConsentState';
import { styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

const StyledButton = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginRight: '10px',
  marginBottom: '5px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));
const StyledButtonLink = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: 0,
  textDecoration: 'underline',
  marginBottom: '10px',
  '&:hover': {
    textDecoration: 'underline',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const CookieDrawer = () => {
  const { t } = useTranslation();

  const { setCookieModalVisibility, saveCookieConsent, isCookieDrawerVisible } =
    useCookieConsentState();

  const { data, isLoading } = useContentful();

  const contentfulTexts = getOne(data.cookieModalText);

  const fields = {
    shortContent: contentfulTexts?.['shortContent'] ?? '',
    heading: contentfulTexts?.['heading'] ?? t('cookieModal.heading'),
    allowAllCookies:
      contentfulTexts?.['allowAllCookies'] ?? t('cookieModal.allow-all-cookies'),
    allowOnlyNecessaryCookies:
      contentfulTexts?.['allowOnlyMandatoryCookies'] ??
      t('cookieModal.allow-only-necessary-cookies'),
  };

  const handleAcceptMandatoryCookies: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    saveCookieConsent({ statistics: false });
  };

  const handleAcceptAllCookies: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    saveCookieConsent({ statistics: true });
  };

  return (
    <Drawer
      variant="persistent"
      id="oph-cookie-drawer"
      PaperProps={{
        sx: {
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.25)',
          zIndex: 1300,
        },
      }}
      anchor="bottom"
      hideBackdrop={true}
      open={!isLoading && isCookieDrawerVisible}>
      <Container maxWidth="xl" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Grid container spacing={1} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={5} xl={6}>
            <Typography variant="h4" sx={{ marginLeft: '0px' }}>
              {fields.heading}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginTop: '15px',
                marginBottom: '15px',
              }}>
              {fields.shortContent}
              <Link
                sx={{ display: 'inline' }}
                href="sivu/tietosuojaselosteet-ja-evasteet">
                Lue lisää
              </Link>
            </Typography>
          </Grid>
          <Grid
            sx={{ margin: '10px 0' }}
            item
            container
            justifyContent={{
              xs: 'flex-start',
              sm: 'center',
            }}
            xs={12}
            md={7}
            xl={6}>
            <Hidden smDown>
              <StyledButtonLink
                variant="text"
                onClick={() => setCookieModalVisibility(true)}>
                {t('cookieModal.cookie-settings')}
              </StyledButtonLink>
            </Hidden>
            <ButtonGroup
              orientation="horizontal"
              color="primary"
              sx={{
                flexWrap: 'wrap',
              }}>
              <Hidden smUp>
                <StyledButtonLink
                  variant="text"
                  onClick={() => setCookieModalVisibility(true)}>
                  {t('cookieModal.cookie-settings')}
                </StyledButtonLink>
              </Hidden>
              <StyledButton
                variant="contained"
                color="primary"
                disableRipple
                onClick={handleAcceptMandatoryCookies}>
                {fields.allowOnlyNecessaryCookies}
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                disableRipple
                onClick={handleAcceptAllCookies}>
                {fields.allowAllCookies}
              </StyledButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </Drawer>
  );
};
