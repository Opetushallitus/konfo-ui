import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  Typography,
  ButtonGroup,
  Divider,
  Modal,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import Cookies from 'js-cookie';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

import { MaterialIcon } from './MaterialIcon';

const StyledModalContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: '9999',
  backgroundColor: colors.white,
  border: '1px solid #ccc',
  boxShadow: '1px 1px 1px ' + colors.grey900,
  padding: '16px',
  boxSizing: 'border-box',
  borderRadius: '10px',
  width: '60%',
  left: '20%',
  top: '5%',
  [theme.breakpoints.down('md')]: {
    width: '90%',
    left: '5%',
  },
}));

const CookieModalCheckbox = styled(Checkbox)({
  boxShadow: 'none',
  fontSize: '2em',
  padding: '5px 2px 5px 5px',
});

const MANDATORY_COOKIE_NAME = 'oph-mandatory-cookies-accepted';

export const CookieModal = () => {
  const { t } = useTranslation();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(
    Boolean(Cookies.get(MANDATORY_COOKIE_NAME))
  );

  const [statisticCookiesAccepted, setStatisticCookiesAccepted] = useState(false);
  const [marketingCookiesAccepted, setMarketingCookiesAccepted] = useState(false);

  const { data, isLoading } = useContentful();

  const contentfulTexts = getOne(data.cookieModalText);

  const fields = {
    shortContent: contentfulTexts?.['shortContent'] ?? '',
    fullContent: contentfulTexts?.['fullContent'] ?? '',
    heading: contentfulTexts?.['heading'] ?? t('cookieModal.heading'),
    expandLinkText: contentfulTexts?.['expandLinkText'] ?? '',
    collapseLinkText: contentfulTexts?.['collapseLinkText'] ?? '',
    settingsButtonText:
      contentfulTexts?.['settingsButtonText'] ?? t('cookieModal.settings'),
    settingsButtonCloseText:
      contentfulTexts?.['settingsButtonCloseText'] ?? t('cookieModal.settings'),
    acceptButtonText: contentfulTexts?.['acceptButtonText'] ?? t('cookieModal.accept'),
    settingsHeaderText: contentfulTexts?.['settingsHeaderText'] ?? '',
    settingsAcceptMandatoryText:
      contentfulTexts?.['settingsAcceptMandatoryText'] ?? t('cookieModal.mandatory'),
    settingsAcceptStatisticText:
      contentfulTexts?.['settingsAcceptStatisticText'] ?? t('cookieModal.statistic'),
    settingsAcceptMarketingText:
      contentfulTexts?.['settingsAcceptMarketingText'] ?? t('cookieModal.marketing'),
  };

  const handleAcceptCookies: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    Cookies.set(MANDATORY_COOKIE_NAME, 'true', {
      expires: 1800,
      path: '/',
    });
    if (statisticCookiesAccepted) {
      Cookies.set('oph-statistic-cookies-accepted', 'true', {
        expires: 1800,
        path: '/',
      });
    }
    if (marketingCookiesAccepted) {
      Cookies.set('oph-marketing-cookies-accepted', 'true', {
        expires: 1800,
        path: '/',
      });
    }
    setCookiesAccepted(true);
  };

  const openSettings = (
    <div id="cookie-modal-settings">
      <Divider sx={{ marginBottom: '15px' }} />
      <Typography
        variant="h3"
        sx={{ margin: '9px 8px 3px 8px', paddingBottom: '10px', fontSize: '1.5em' }}>
        {fields.settingsHeaderText}
      </Typography>
      <FormGroup>
        <FormControlLabel
          label={fields.settingsAcceptMandatoryText}
          control={<CookieModalCheckbox id="mandatoryCookies" checked disabled />}
        />
        <FormControlLabel
          label={fields.settingsAcceptStatisticText}
          control={
            <CookieModalCheckbox
              id="statisticCookies"
              checked={statisticCookiesAccepted}
              onClick={() => setStatisticCookiesAccepted(!statisticCookiesAccepted)}
            />
          }
        />
        <FormControlLabel
          label={fields.settingsAcceptMarketingText}
          control={
            <CookieModalCheckbox
              id="marketingCookies"
              checked={marketingCookiesAccepted}
              onClick={() => setMarketingCookiesAccepted(!marketingCookiesAccepted)}
            />
          }
        />
      </FormGroup>
    </div>
  );

  return (
    <Modal
      id="oph-cookie-modal-backdrop"
      sx={{ overflowY: 'auto' }}
      open={!(isLoading || cookiesAccepted)}>
      <StyledModalContent>
        <Typography
          variant="h2"
          sx={{ marginTop: '0px', marginLeft: '3%', marginRight: '3%' }}>
          {fields.heading}
        </Typography>
        <Typography
          variant="body1"
          whiteSpace="pre-wrap"
          sx={{
            marginTop: '15px',
            marginBottom: '15px',
            marginLeft: '3%',
            marginRight: '3%',
          }}>
          {fields.shortContent}
        </Typography>
        <Button
          id="cookie-text-expand-link"
          sx={{ whiteSpace: 'nowrap', width: 'fit-contect', marginBottom: '15px' }}
          variant="text"
          endIcon={
            <MaterialIcon
              icon={fullCookieInfoOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            />
          }
          disableRipple
          onClick={() => setFullCookieInfoOpen(!fullCookieInfoOpen)}>
          <Typography
            variant="body1"
            sx={{ color: colors.brandGreen, fontWeight: 'bold', display: 'inline' }}>
            {fullCookieInfoOpen ? fields.collapseLinkText : fields.expandLinkText}
          </Typography>
        </Button>
        {fullCookieInfoOpen ? (
          <Typography variant="body1" id="cookie-modal-fulltext" whiteSpace="pre-wrap">
            <Markdown>{fields.fullContent}</Markdown>
          </Typography>
        ) : null}
        {settingsOpen ? openSettings : null}
        <ButtonGroup
          sx={{ float: 'right', paddingRight: '20px' }}
          orientation="horizontal"
          color="primary">
          <Button
            sx={{ fontWeight: 'bold' }}
            variant="outlined"
            size="large"
            color="primary"
            disableRipple
            onClick={() => setSettingsOpen(!settingsOpen)}>
            {settingsOpen ? fields.settingsButtonCloseText : fields.settingsButtonText}
          </Button>
          <Button
            sx={{ fontWeight: 'bold' }}
            variant="contained"
            size="large"
            color="primary"
            disableRipple
            onClick={handleAcceptCookies}>
            {fields.acceptButtonText}
          </Button>
        </ButtonGroup>
      </StyledModalContent>
    </Modal>
  );
};
