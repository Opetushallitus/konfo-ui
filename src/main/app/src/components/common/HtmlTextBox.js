import React, { useState } from 'react';

import { makeStyles, Typography, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TruncateMarkup from 'react-truncate-markup';

import { educationTypeColorCode } from '#/src/colors';
import { ColoredPaperContent } from '#/src/components/common/ColoredPaperContent';
import Spacer from '#/src/components/common/Spacer';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const useStyles = makeStyles((theme) => ({
  textArea: {
    margin: '60px auto',
    width: '63%',
    ...theme.typography.body1,
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline',
    padding: 0,
    margin: '35px 0 0',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '1.375rem',
    color: '#378703',
    fontFamily: 'Open Sans',
  },
}));

const LinkButton = ({ children, onClick }) => {
  const classes = useStyles();
  return (
    <button className={classes.linkButton} onClick={onClick}>
      {children}
    </button>
  );
};

const Ellipsis = ({ onShowMore }) => {
  const { t } = useTranslation();
  return (
    <>
      <span>...</span>
      <TruncateMarkup.Atom>
        <Box textAlign="center">
          <LinkButton onClick={onShowMore}>{t('haku.näytä_lisää')}</LinkButton>
        </Box>
      </TruncateMarkup.Atom>
    </>
  );
};

const HtmlTextBox = (props) => {
  const { heading, className, html, additionalContent } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}
      data-cy="kuvaus">
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <ColoredPaperContent backgroundColor={educationTypeColorCode.ammatillinenGreenBg}>
        <Box display="flex" flexDirection="column" className={classes.textArea}>
          <TruncateMarkup
            lines={isExpanded ? Infinity : 12}
            ellipsis={<Ellipsis onShowMore={() => setIsExpanded(true)} />}>
            <div>
              {sanitizedHTMLParser(html)}
              <TruncateMarkup.Atom>{additionalContent}</TruncateMarkup.Atom>
            </div>
          </TruncateMarkup>
          {isExpanded && (
            <LinkButton onClick={() => setIsExpanded(false)}>
              {t('haku.näytä_vähemmän')}
            </LinkButton>
          )}
        </Box>
      </ColoredPaperContent>
    </Box>
  );
};

export default HtmlTextBox;
