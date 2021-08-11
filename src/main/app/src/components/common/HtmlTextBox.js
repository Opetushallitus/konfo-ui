import React, { useState } from 'react';

import { makeStyles, Typography, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

import { educationTypeColorCode } from '#/src/colors';
import { ColoredPaperContent } from '#/src/components/common/ColoredPaperContent';
import Spacer from '#/src/components/common/Spacer';

const useStyles = makeStyles((theme) => ({
  textArea: {
    margin: '60px auto',
    width: '63%',
    ...theme.typography.body1,
  },
  showLink: {
    margin: '0 auto',
    textAlign: 'center',
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

const HtmlTextBox = (props) => {
  const { heading, className, html, additionalContent } = props;

  const { t } = useTranslation();
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLines = (event) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };
  const reflow = (rleState) => {
    const { clamped } = rleState;
    if (isTruncated !== clamped) {
      setIsTruncated(clamped);
    }
  };
  const classes = useStyles();

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
        <Box className={classes.textArea}>
          <HTMLEllipsis
            unsafeHTML={html}
            maxLine={isExpanded ? 1000 : 8}
            onReflow={reflow}
          />
          {isTruncated || isExpanded ? (
            <div className={classes.showLink}>
              <button className={classes.linkButton} onClick={toggleLines}>
                {isExpanded ? t('haku.näytä_vähemmän') : t('haku.näytä_lisää')}
              </button>
            </div>
          ) : null}
          {additionalContent}
        </Box>
      </ColoredPaperContent>
    </Box>
  );
};

export default HtmlTextBox;
