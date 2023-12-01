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

const PREFIX = 'CookieModal';

const classes = {
  modalBackdrop: `${PREFIX}-modalBackdrop`,
  modalHeader: `${PREFIX}-modalHeader`,
  icon: `${PREFIX}-icon`,
  modalText: `${PREFIX}-modalText`,
  modalContent: `${PREFIX}-modalContent`,
  settings: `${PREFIX}-settings`,
  settingsCheckbox: `${PREFIX}-settingsCheckbox`,
  textExpandLink: `${PREFIX}-textExpandLink`,
  buttons: `${PREFIX}-buttons`,
  divider: `${PREFIX}-divider`,
  settingsHeader: `${PREFIX}-settingsHeader`,
};

const StyledModal = styled(Modal)(({ theme }) => ({
  overflowY: 'auto',

  [`& .${classes.modalHeader}`]: {
    marginTop: '0px',
    marginLeft: '3%',
    marginRight: '3%',
  },

  [`& .${classes.icon}`]: {
    position: 'absolute',
  },

  [`& .${classes.modalText}`]: {
    marginTop: '15px',
    marginBottom: '15px',
    marginLeft: '3%',
    marginRight: '3%',
    whiteSpace: 'pre-wrap !important',
  },

  [`& .${classes.modalContent}`]: {
    position: 'absolute',
    zIndex: '9999',
    backgroundColor: colors.white,
    border: '1px solid #ccc',
    boxShadow: '1px 1px 1px ' + colors.black,
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
  },

  [`& .${classes.settings}`]: {
    marginTop: '15px',
    marginLeft: '2%',
  },

  [`& .${classes.settingsCheckbox}`]: {
    boxShadow: 'none',
    fontSize: '2em',
    padding: '5px 2px 5px 5px',
  },

  [`& .${classes.textExpandLink}`]: {
    color: colors.brandGreen,
    marginTop: '5px',
    marginBottom: '15px',
    marginLeft: '2%',
    fontWeight: 'bold',
    display: 'inline',
  },

  [`& .${classes.buttons}`]: {
    float: 'right',
    paddingRight: '20px',
  },

  [`& .${classes.divider}`]: {
    marginBottom: '15px',
  },

  [`& .${classes.settingsHeader}`]: {
    margin: '9px 8px 3px 8px',
    paddingBottom: '10px',
    fontSize: '1.5em',
  },
}));
const StyledCheckbox = styled(Checkbox)({
  padding: '0 9px 0 9px',
  marginLeft: 0,
});
const StyledButton = styled(Button)({
  '&:focus': {
    boxShadow: `
    0px 3px 1px -2px rgba(0,0,0,0.2), 
    0px 2px 2px 0px rgba(0,0,0,0.14), 
    0px 1px 5px 0px rgba(0,0,0,0.12);`,
  },
});
const mandatoryCookieName = 'oph-mandatory-cookies-accepted';

export const CookieModal = () => {
  const { t } = useTranslation();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(
    Boolean(Cookies.get(mandatoryCookieName))
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
    Cookies.set(mandatoryCookieName, 'true', {
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
    <div id="cookie-modal-settings" className={classes.settings}>
      <Divider className={classes.divider} />
      <Typography variant="h3" className={classes.settingsHeader}>
        {fields.settingsHeaderText}
      </Typography>
      <FormGroup>
        <FormControlLabel
          label={fields.settingsAcceptMandatoryText}
          control={
            <StyledCheckbox
              id="mandatoryCookies"
              className={classes.settingsCheckbox}
              checked
              disabled
            />
          }
        />
        <FormControlLabel
          label={fields.settingsAcceptStatisticText}
          control={
            <StyledCheckbox
              id="statisticCookies"
              className={classes.settingsCheckbox}
              checked={statisticCookiesAccepted}
              onClick={() => setStatisticCookiesAccepted(!statisticCookiesAccepted)}
            />
          }
        />
        <FormControlLabel
          label={fields.settingsAcceptMarketingText}
          control={
            <StyledCheckbox
              id="marketingCookies"
              className={classes.settingsCheckbox}
              checked={marketingCookiesAccepted}
              onClick={() => setMarketingCookiesAccepted(!marketingCookiesAccepted)}
            />
          }
        />
      </FormGroup>
    </div>
  );

  return (
    <StyledModal
      id="oph-cookie-modal-backdrop"
      className={classes.modalBackdrop}
      open={!(isLoading || cookiesAccepted)}>
      <div id="cookie-modal-content" className={classes.modalContent}>
        <Typography variant="h2" className={classes.modalHeader}>
          {fields.heading}
        </Typography>
        <Typography variant="body1" className={classes.modalText}>
          {fields.shortContent}
        </Typography>
        <StyledButton
          sx={{ whiteSpace: 'nowrap', width: 'fit-contect' }}
          variant="text"
          id="cookie-text-expand-link"
          endIcon={
            <MaterialIcon
              icon={fullCookieInfoOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            />
          }
          className={classes.textExpandLink}
          disableRipple
          onClick={() => setFullCookieInfoOpen(!fullCookieInfoOpen)}>
          <Typography variant="body1" className={classes.textExpandLink}>
            {fullCookieInfoOpen ? fields.collapseLinkText : fields.expandLinkText}
          </Typography>
        </StyledButton>
        {fullCookieInfoOpen ? (
          <Typography
            variant="body1"
            id="cookie-modal-fulltext"
            className={classes.modalText}>
            <Markdown>{fields.fullContent}</Markdown>
          </Typography>
        ) : null}
        {settingsOpen ? openSettings : null}
        <ButtonGroup className={classes.buttons} orientation="horizontal" color="primary">
          <StyledButton
            sx={{ fontWeight: 'bold' }}
            variant="outlined"
            size="large"
            color="primary"
            disableRipple
            onClick={() => setSettingsOpen(!settingsOpen)}>
            {settingsOpen ? fields.settingsButtonCloseText : fields.settingsButtonText}
          </StyledButton>
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
      </div>
    </StyledModal>
  );
};
