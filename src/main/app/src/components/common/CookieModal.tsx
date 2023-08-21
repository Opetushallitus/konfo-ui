import React, { useState } from 'react';

import { Button, Typography, ButtonGroup, Divider, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { KonfoCheckbox } from '#/src/components/common/Checkbox';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';

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
    <MaterialIcon icon="arrow_drop_up" className={classes.icon} />
  ) : (
    <MaterialIcon icon="arrow_drop_down" className={classes.icon} />
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
    </StyledModal>
  );
};
