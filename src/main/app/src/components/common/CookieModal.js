import React, { Component, useState } from 'react';

import { makeStyles } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Cookies from 'js-cookie';
import Markdown from 'markdown-to-jsx';
import { observer } from 'mobx-react-lite';

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
    'background-color': 'white',
    width: '60%',
    border: '1px solid #ccc',
    'box-shadow': '1px 1px 1px black',
    padding: '16px',
    left: '20%',
    top: '5%',
    'box-sizing': 'border-box',
    'border-radius': '10px',
    a: {
      color: '#0a789c !important',
      'margin-top': '5px',
      'margin-bottom': '15px',
      'text-decoration': 'none',
    },
  },

  settings: {
    'margin-top': '15px',
    'margin-left': '3%',
  },

  settingsCheckbox: {
    outline: '1px #3A7A10',
    'box-shadow': 'none',
    'font-size': '2em',
    ':checked': {
      'background-color': '#3A7A10',
      icon: 'pointer',
    },
  },

  settingsButton: {
    'margin-top': '15px',
    'margin-right': '5px',
    height: '40px',
    color: '#3A7A10',
    'background-color': 'white',
    padding: '4px 12px 4px',
    cursor: 'pointer',
    border: '2px solid transparent',
    'border-color': '#3A7A10',
    'border-radius': '4px',
    'font-weight': '600',
    float: 'right',
    '&:hover': {
      backgroundColor: '#e6ffc1',
    },
  },

  acceptButton: {
    'margin-top': '15px',
    'margin-right': '5px',
    height: '40px',
    color: '#FFFFFF',
    'background-color': '#3A7A10',
    padding: '4px 12px 4px',
    cursor: 'pointer',
    border: '1px solid transparent',
    'border-radius': '4px',
    'border-color': '#3A7A10',
    'font-weight': '600',
    float: 'right',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },

  textExpandLink: {
    color: '#3A7A10',
    'margin-top': '5px',
    'margin-bottom': '15px',
    'margin-left': '3%',
    'font-weight': 'bold',
  },
});

const CookieModal = (props) => {
  const classes = useStyles();

  const mandatoryCookieName = 'oph-konfo-mandatory-cookies-accepted';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);
  const [cookiesAlreadyAccepted, setCookiesAlreadyAccepted] = useState(
    Cookies.get(mandatoryCookieName)
  );

  const { data, isLoading } = useContentful();
  console.log('isLoading:' + isLoading);

  const single = (entry) => Object.values(entry || [])[0] || {};

  const contentfulTexts = single(data.cookieModalText);

  const fields = {
    shortContent: contentfulTexts['shortContent'] || '',
    fullContent: contentfulTexts['fullContent'] || '',
    heading: contentfulTexts['heading'] || '',
    expandLinkText: contentfulTexts['expandLinkText'] || '',
    settingsButtonText: contentfulTexts['settingsButtonText'] || '',
    settingsButtonCloseText: contentfulTexts['settingsButtonCloseText'] || '',
    acceptButtonText: contentfulTexts['acceptButtonText'] || '',
    settingsHeaderText: contentfulTexts['settingsHeaderText'] || '',
    settingsAcceptMandatoryText: contentfulTexts['settingsAcceptMandatoryText'] || '',
    settingsAcceptStatisticText: contentfulTexts['settingsAcceptStatisticText'] || '',
    settingsAcceptMarketingText: contentfulTexts['settingsAcceptMarketingText'] || '',
  };

  function handleAcceptCookies(e) {
    e.preventDefault();
    const statisticCheckBox = document.getElementById('statisticCookies');
    const marketingCheckBox = document.getElementById('marketingCookies');
    Cookies.set(mandatoryCookieName, 'true', {
      expires: 1800,
      path: '/',
    });
    if (statisticCheckBox && statisticCheckBox.checked) {
      Cookies.set('oph-konfo-statistic-cookies-accepted', 'true', {
        expires: 1800,
        path: '/',
      });
    }
    if (marketingCheckBox && marketingCheckBox.checked) {
      Cookies.set('oph-konfo-marketing-cookies-accepted', 'true', {
        expires: 1800,
        path: '/',
      });
    }
    setCookiesAlreadyAccepted(true);
  }

  const openSettings = (
    <div id="cookie-modal-settings" className={classes.settings}>
      <div className="cookie-modal-text"> {fields.settingsHeaderText}</div>
      <input
        type="checkbox"
        id="mandatoryCookies"
        name="mandatoryCookies"
        value="mandatoryCookies"
        className={classes.settingsCheckbox}
        checked={true}
        disabled={true}
      />
      <label htmlFor="mandatoryCookies">{fields.settingsAcceptMandatoryText}</label>
      <br />
      <input
        type="checkbox"
        id="statisticCookies"
        name="statisticCookies"
        value="statisticCookies"
        className={classes.settingsCheckbox}
      />
      <label htmlFor="statisticCookies">{fields.settingsAcceptStatisticText}</label>
      <br />
      <input
        type="checkbox"
        id="marketingCookies"
        name="marketingCookies"
        value="marketingCookies"
        className={classes.settingsCheckbox}
      />
      <label htmlFor="marketingCookies">{fields.settingsAcceptMarketingText}</label>
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
          <button
            id="cookie-modal-accept-btn"
            className={classes.acceptButton}
            onClick={handleAcceptCookies}>
            {fields.acceptButtonText}
          </button>
          <button
            id="cookie-modal-settings-btn"
            className={classes.settingsButton}
            onClick={() => setSettingsOpen(!settingsOpen)}>
            {settingsOpen ? fields.settingsButtonCloseText : fields.settingsButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
