import React, { useState } from 'react';

import {
  Button,
  Switch,
  Typography,
  ButtonGroup,
  Divider,
  Modal,
  FormControlLabel,
  FormGroup,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
} from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';
import { useCookieConsentState } from '#/src/hooks/useCookieConsentState';
import { styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

import { MaterialIcon } from './MaterialIcon';

const StyledModalContent = styled('div')(({ theme }) => ({
  zIndex: '9999',
  backgroundColor: colors.white,
  border: '1px solid #ccc',
  boxShadow: '1px 1px 1px ' + colors.grey900,
  padding: '16px',
  boxSizing: 'border-box',
  borderRadius: '10px',
  top: '5%',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '40px auto',
  [theme.breakpoints.down('xl')]: {
    width: '80%',
  },
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1300px',
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)({
  marginBottom: '10px',
  alignItems: 'start',
});

const StyledButton = styled(Button)({
  width: 'fit-content',
  fontWeight: 'bold',
});

const StyledAccordionSummary = styled(AccordionSummary)({
  color: colors.brandGreen,
  fontWeight: 'bold',
  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 10px',
  padding: '0 16px 0 16px',
});

export const CookieModal = () => {
  const { t } = useTranslation();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isCookieModalVisible, saveCookieConsent } = useCookieConsentState();

  const [fullCookieInfoOpen, setFullCookieInfoOpen] = useState(false);

  const [isStatisticsCookiesAccepted, setIsStatisticsCookiesAccepted] =
    useState<boolean>(false);

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
    allowAllCookies:
      contentfulTexts?.['allowAllCookies'] ?? t('cookieModal.allow-all-cookies'),
    allowOnlyNecessaryCookies:
      contentfulTexts?.['allowOnlyMandatoryCookies'] ??
      t('cookieModal.allow-only-necessary-cookies'),
    saveSettingsText:
      contentfulTexts?.['saveSettingsText'] ?? t('cookieModal.save-settings'),
    settingsHeaderText: contentfulTexts?.['settingsHeaderText'] ?? '',
    statisticsCheckboxTitleText: contentfulTexts?.['statisticsCheckboxTitleText'] ?? '',
    statisticsCheckboxContentText:
      contentfulTexts?.['statisticsCheckboxContentText'] ?? '',
    mandatoryCheckboxTitleText: contentfulTexts?.['mandatoryCheckboxTitleText'] ?? '',
    mandatoryCheckboxContentText: contentfulTexts?.['mandatoryCheckboxContentText'] ?? '',
  };

  const handleSaveCookieSettings: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    saveCookieConsent({ statistics: isStatisticsCookiesAccepted });
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

  const handleAccordionExpandedChange = (
    e: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setFullCookieInfoOpen(isExpanded);
  };

  const openSettings = (
    <div id="cookie-modal-settings">
      <Typography variant="h3" sx={{ margin: '40px 0 30px', fontSize: '1.5em' }}>
        {fields.settingsHeaderText}
      </Typography>
      <FormGroup>
        <StyledFormControlLabel
          label={
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {fields.mandatoryCheckboxTitleText}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.38)' }}>
                {fields.mandatoryCheckboxContentText}
              </Typography>
            </>
          }
          control={<Switch id="mandatoryCookies" checked disabled />}
        />
        <StyledFormControlLabel
          label={
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {fields.statisticsCheckboxTitleText}
              </Typography>
              <Typography variant="body1">
                {fields.statisticsCheckboxContentText}
              </Typography>
            </>
          }
          control={
            <Switch
              id="statisticCookies"
              checked={isStatisticsCookiesAccepted}
              onClick={() => setIsStatisticsCookiesAccepted((accepted) => !accepted)}
            />
          }
        />
        <Divider sx={{ marginTop: '5px', marginBottom: '17px' }} />
        <Button
          sx={{ fontWeight: 'bold' }}
          variant="contained"
          size="large"
          color="primary"
          disableRipple
          onClick={handleSaveCookieSettings}>
          {fields.saveSettingsText}
        </Button>
      </FormGroup>
    </div>
  );

  return (
    <Modal
      id="oph-cookie-modal-backdrop"
      sx={{ overflowY: 'auto' }}
      open={!isLoading && isCookieModalVisible}>
      <StyledModalContent>
        <Container sx={{ marginTop: '20px', marginBottom: '20px' }}>
          <Typography variant="h2" sx={{ marginTop: '0px' }}>
            {fields.heading}
          </Typography>
          <Typography
            variant="body1"
            whiteSpace="pre-wrap"
            sx={{
              marginTop: '15px',
              marginBottom: '15px',
            }}>
            {fields.shortContent}
          </Typography>

          <Accordion
            expanded={fullCookieInfoOpen}
            onChange={handleAccordionExpandedChange}
            sx={{ boxShadow: 'none' }}
            disableGutters>
            <StyledAccordionSummary
              expandIcon={
                <MaterialIcon icon="expand_more" sx={{ color: colors.brandGreen }} />
              }>
              {fullCookieInfoOpen ? fields.collapseLinkText : fields.expandLinkText}
            </StyledAccordionSummary>
            <AccordionDetails sx={{ padding: '8px 0 16px' }}>
              <Typography
                variant="body1"
                id="cookie-modal-fulltext"
                whiteSpace="pre-wrap">
                <Markdown>{fields.fullContent}</Markdown>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Grid
            sx={{ marginTop: '30px' }}
            container
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Grid item>
              <ButtonGroup orientation="horizontal" color="primary">
                <StyledButton
                  sx={{
                    marginRight: '10px',
                  }}
                  variant="contained"
                  color="primary"
                  disableRipple
                  onClick={handleAcceptAllCookies}>
                  {fields.allowAllCookies}
                </StyledButton>
                <StyledButton
                  variant="contained"
                  color="primary"
                  disableRipple
                  onClick={handleAcceptMandatoryCookies}>
                  {fields.allowOnlyNecessaryCookies}
                </StyledButton>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Chip
                sx={{ float: 'right' }}
                variant="outlined"
                label={
                  settingsOpen
                    ? fields.settingsButtonCloseText
                    : fields.settingsButtonText
                }
                onClick={() => setSettingsOpen(!settingsOpen)}
                onDelete={() => setSettingsOpen(!settingsOpen)}
                deleteIcon={
                  settingsOpen ? (
                    <MaterialIcon icon="expand_less" />
                  ) : (
                    <MaterialIcon icon="expand_more" />
                  )
                }
              />
            </Grid>
          </Grid>
          {settingsOpen ? openSettings : null}
        </Container>
      </StyledModalContent>
    </Modal>
  );
};
