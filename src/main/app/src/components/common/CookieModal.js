import React, { useState } from 'react';

import {
  makeStyles,
  Button,
  Typography,
  ButtonGroup,
  Divider,
  Modal,
} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Cookies from 'js-cookie';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { KonfoCheckbox } from '#/src/components/common/Checkbox';
import { useContentful } from '#/src/hooks';

const useStyles = makeStyles((theme) => ({
  modalBackdrop: {
    'overflow-y': 'auto',
  },

  modalHeader: {
    'margin-top': '0px',
    'margin-left': '3%',
    'margin-right': '3%',
  },

  icon: {
    position: 'absolute',
  },

  modalText: {
    'margin-top': '15px',
    'margin-bottom': '15px',
    'margin-left': '3%',
    'margin-right': '3%',
    'white-space': 'pre-wrap !important',
  },

  modalContent: {
    position: 'absolute',
    'z-index': '9999',
    'background-color': colors.white,
    border: '1px solid #ccc',
    'box-shadow': '1px 1px 1px ' + colors.black,
    padding: '16px',
    'box-sizing': 'border-box',
    'border-radius': '10px',
    width: '60%',
    left: '20%',
    top: '5%',
    [theme.breakpoints.down('md')]: {
      width: '90%',
      left: '5%',
    },
  },

  settings: {
    'margin-top': '15px',
    'margin-left': '2%',
  },

  settingsCheckbox: {
    'box-shadow': 'none',
    'font-size': '2em',
    padding: '5px 2px 5px 5px',
  },

  textExpandLink: {
    color: colors.brandGreen,
    'margin-top': '5px',
    'margin-bottom': '15px',
    'margin-left': '2%',
    'font-weight': 'bold',
    display: 'inline',
  },

  buttons: {
    float: 'right',
    'padding-right': '20px',
  },

  divider: {
    'margin-bottom': '15px',
  },

  settingsHeader: {
    margin: '9px 8px 3px 8px',
    'padding-bottom': '10px',
    'font-size': '1.5em',
  },
}));

const mandatoryCookieName = 'oph-mandatory-cookies-accepted';

const single = (entry) => Object.values(entry || [])[0] || {};

export const CookieModal = () => {
  const { t } = useTranslation();

  const classes = useStyles();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(
    Cookies.get(mandatoryCookieName)
  );

  const [statisticCookiesAccepted, setStatisticCookiesAccepted] = useState(false);
  const [marketingCookiesAccepted, setMarketingCookiesAccepted] = useState(false);

  const { data, isLoading } = useContentful();

  const contentfulTexts = single(data.cookieModalText);

  const fields = {
    shortContent: contentfulTexts['shortContent'] || '',
    fullContent: contentfulTexts['fullContent'] || '',
    heading: contentfulTexts['heading'] || t('cookieModal.heading'),
    expandLinkText: contentfulTexts['expandLinkText'] || '',
    settingsButtonText:
      contentfulTexts['settingsButtonText'] || t('cookieModal.settings'),
    settingsButtonCloseText:
      contentfulTexts['settingsButtonCloseText'] || t('cookieModal.settings'),
    acceptButtonText: contentfulTexts['acceptButtonText'] || t('cookieModal.accept'),
    settingsHeaderText: contentfulTexts['settingsHeaderText'] || '',
    settingsAcceptMandatoryText:
      contentfulTexts['settingsAcceptMandatoryText'] || t('cookieModal.mandatory'),
    settingsAcceptStatisticText:
      contentfulTexts['settingsAcceptStatisticText'] || t('cookieModal.statistic'),
    settingsAcceptMarketingText:
      contentfulTexts['settingsAcceptMarketingText'] || t('cookieModal.marketing'),
  };

  function handleAcceptCookies(e) {
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
  }

  const openSettings = (
    <div id="cookie-modal-settings" className={classes.settings}>
      <Divider className={classes.divider} />
      <Typography variant="h3" className={classes.settingsHeader}>
        {fields.settingsHeaderText}
      </Typography>
      <div>
        <KonfoCheckbox
          id="mandatoryCookies"
          className={classes.settingsCheckbox}
          checked
          disabled
        />
        <label htmlFor="mandatoryCookies">{fields.settingsAcceptMandatoryText}</label>
      </div>
      <div>
        <KonfoCheckbox
          id="statisticCookies"
          className={classes.settingsCheckbox}
          checked={statisticCookiesAccepted}
          disableRipple
          onClick={() => setStatisticCookiesAccepted(!statisticCookiesAccepted)}
        />
        <label htmlFor="statisticCookies">{fields.settingsAcceptStatisticText}</label>
      </div>
      <div>
        <KonfoCheckbox
          id="marketingCookies"
          className={classes.settingsCheckbox}
          checked={marketingCookiesAccepted}
          disableRipple
          onClick={() => setMarketingCookiesAccepted(!marketingCookiesAccepted)}
        />
        <label htmlFor="marketingCookies">{fields.settingsAcceptMarketingText}</label>
      </div>
    </div>
  );

  const expandIcon = fullCookieInfoOpen ? (
    <ArrowDropUp className={classes.icon} />
  ) : (
    <ArrowDropDown className={classes.icon} />
  );

  return (
    <Modal
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
        <div
          id="cookie-text-expand-link"
          className={classes.textExpandLink}
          onClick={() => setFullCookieInfoOpen(!fullCookieInfoOpen)}>
          <Typography variant="body1" className={classes.textExpandLink}>
            {fields.expandLinkText} {expandIcon}
          </Typography>
        </div>
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
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => setSettingsOpen(!settingsOpen)}>
            {settingsOpen ? fields.settingsButtonCloseText : fields.settingsButtonText}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleAcceptCookies}>
            {fields.acceptButtonText}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};
