import React, { useState } from 'react';

import { makeStyles, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import TruncateMarkup from 'react-truncate-markup';

import { educationTypeColorCode } from '#/src/colors';
import { ColoredPaperContent } from '#/src/components/common/ColoredPaperContent';
import { TextButton } from '#/src/components/common/TextButton';
import { sanitizedHTMLParser } from '#/src/tools/utils';

import { PageSection } from './PageSection';

const useStyles = makeStyles((theme) => ({
  textArea: {
    margin: '60px auto',
    width: '63%',
    ...theme.typography.body1,
  },
}));

const Ellipsis = ({ onShowMore }) => {
  const { t } = useTranslation();
  return (
    <>
      <span>...</span>
      <TruncateMarkup.Atom>
        <Box textAlign="center">
          <TextButton onClick={onShowMore}>{t('haku.näytä_lisää')}</TextButton>
        </Box>
      </TruncateMarkup.Atom>
    </>
  );
};

const HtmlTextBox = (props) => {
  const { heading, html, additionalContent } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <PageSection heading={heading}>
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
            <TextButton onClick={() => setIsExpanded(false)}>
              {t('haku.näytä_vähemmän')}
            </TextButton>
          )}
        </Box>
      </ColoredPaperContent>
    </PageSection>
  );
};

export default HtmlTextBox;
