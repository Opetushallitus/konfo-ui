import React, { useState } from 'react';

import { makeStyles, Checkbox, Button, Typography, ButtonGroup } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Cookies from 'js-cookie';
import Markdown from 'markdown-to-jsx';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

const useStyles = makeStyles({
  modalBackdrop: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    'z-index': '9999',
    left: '0',
    top: '0',
    'background-color': 'rgba(0, 0, 0, 0.5)',
    color: '#000000',
    display: 'block',
    'overflow-y': 'auto',
  },

  modal_header: {
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
    width: '60%',
    border: '1px solid #ccc',
    'box-shadow': '1px 1px 1px ' + colors.black,
    padding: '16px',
    left: '20%',
    top: '5%',
    'box-sizing': 'border-box',
    'border-radius': '10px',
    '@media (max-width:960px)': {
      width: '90%',
      left: '5%',
    },
  },

  settings: {
    'margin-top': '15px',
    'margin-left': '2%',
  },

  settingsCheckbox: {
    outline: '1px #3A7A10',
    'box-shadow': 'none',
    'font-size': '2em',
    ':checked': {
      'background-color': colors.brandGreen,
      icon: 'pointer',
    },
  },

  textExpandLink: {
    color: colors.brandGreen,
    'margin-top': '5px',
    'margin-bottom': '15px',
    'margin-left': '3%',
    'font-weight': 'bold',
  },

  buttons: {
    float: 'right',
    'padding-right': '20px',
  },
});

const CookieModal = (props) => {
  const classes = useStyles();

  const mandatoryCookieName = 'oph-mandatory-cookies-accepted';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);
  const [cookiesAlreadyAccepted, setCookiesAlreadyAccepted] = useState(
    Cookies.get(mandatoryCookieName)
  );

  const [statisticCookiesAccepted, setStatisticCookiesAccepted] = useState(false);
  const [marketingCookiesAccepted, setMarketingCookiesAccepted] = useState(false);

  const { data, isLoading } = useContentful();

  const single = (entry) => Object.values(entry || [])[0] || {};

  const contentfulTexts = single(data.cookieModalText);

  const fields = {
    shortContent: contentfulTexts['shortContent'] || '',
    fullContent: contentfulTexts['fullContent'] || '',
    heading: contentfulTexts['heading'] || '',
    expandLinkText: contentfulTexts['expandLinkText'] || '',
    settingsButtonText: contentfulTexts['settingsButtonText'] || '',
    settingsButtonCloseText: contentfulTexts['settingsButtonCloseText'] || '',
    acceptButtonText: contentfulTexts['acceptButtonText'] || 'Hyväksy',
    settingsHeaderText: contentfulTexts['settingsHeaderText'] || '',
    settingsAcceptMandatoryText: contentfulTexts['settingsAcceptMandatoryText'] || '',
    settingsAcceptStatisticText: contentfulTexts['settingsAcceptStatisticText'] || '',
    settingsAcceptMarketingText: contentfulTexts['settingsAcceptMarketingText'] || '',
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
    setCookiesAlreadyAccepted(true);
  }

  const openSettings = (
    <div id="cookie-modal-settings" className={classes.settings}>
      <hr />
      <h3 className="cookie-modal-text"> {fields.settingsHeaderText}</h3>
      <div>
        <Checkbox
          id="mandatoryCookies"
          className={classes.settingsCheckbox}
          checked
          disabled
        />
        <label htmlFor="mandatoryCookies">{fields.settingsAcceptMandatoryText}</label>
      </div>
      <div>
        <Checkbox
          id="statisticCookies"
          className={classes.settingsCheckbox}
          checked={statisticCookiesAccepted}
          disableripple
          onClick={() => setStatisticCookiesAccepted(!statisticCookiesAccepted)}
        />
        <label htmlFor="statisticCookies">{fields.settingsAcceptStatisticText}</label>
      </div>
      <div>
        <Checkbox
          id="marketingCookies"
          className={classes.settingsCheckbox}
          checked={marketingCookiesAccepted}
          disableripple
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

  return isLoading || cookiesAlreadyAccepted ? null : (
    <div id="cookie-modal-backdrop" className={classes.modalBackdrop}>
      <div id="cookie-modal-content" className={classes.modalContent}>
        <h2 className={classes.modal_header}> {fields.heading} </h2>
        <div className={classes.modalText}>{fields.shortContent}</div>
        <div>
          <p
            id="cookie-text-expand-link"
            className={classes.textExpandLink}
            onClick={() => setFullCookieInfoOpen(!fullCookieInfoOpen)}>
            {fields.expandLinkText} {expandIcon}
          </p>
        </div>
        {fullCookieInfoOpen ? (
          <div id="cookie-modal-fulltext" className={classes.modalText}>
            <Markdown>{fields.fullContent}</Markdown>
          </div>
        ) : null}
        {settingsOpen ? openSettings : null}
        <div>
          <ButtonGroup
            className={classes.buttons}
            orientation="horizontal"
            color="primary">
            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={() => setSettingsOpen(!settingsOpen)}>
              <Typography style={{ color: colors.brandGreen }} variant="body1">
                {settingsOpen
                  ? fields.settingsButtonCloseText
                  : fields.settingsButtonText}
              </Typography>
            </Button>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleAcceptCookies}>
              <Typography style={{ color: colors.white }} variant="body1">
                {fields.acceptButtonText}
              </Typography>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
