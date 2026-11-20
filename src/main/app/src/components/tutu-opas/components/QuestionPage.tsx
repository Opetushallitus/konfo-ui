import { Box } from '@mui/material';
import { OphButton, OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';

import { Dispatch, useState } from 'react';
import { LanguageCode } from '#/src/types/common';
import { useLanguageState } from '#/src/hooks';
import { isEmpty } from 'lodash-es';
import parse, { Element, DOMNode } from 'html-react-parser';
import { TutuObject } from '../types';
import { NavigationButton } from '../components/NavigationButton';
import { AnswerOptions } from '../components/AnswerOptions';

export const QuestionPage = ({
  setIsStartPage,
  tutuConfigObjects,
}: {
  setIsStartPage: Dispatch<boolean>;
  tutuConfigObjects: Array<TutuObject>;
}) => {
  const [lng] = useLanguageState();
  const { t } = useTranslation();

  const frontPageObject = tutuConfigObjects.find((obj: TutuObject) => obj.is_frontpage);
  const [currentObject, setCurrentObject] = useState<TutuObject | undefined>(
    frontPageObject
  );

  const language = lng ?? 'fi';
  const translation = currentObject?.translations[language as LanguageCode];
  const answerOptions = translation?.answers;

  const parsedResponseBody = parse(translation?.body || '', {
    replace(domNode: DOMNode) {
      if (
        domNode instanceof Element &&
        domNode.name === 'a' &&
        domNode.attribs.href.startsWith('/node')
      ) {
        domNode.attribs.href = 'https://oph.fi' + domNode.attribs.href;
      }
    },
  });

  return (
    <>
      <OphTypography variant="h1">{translation?.question}</OphTypography>
      {isEmpty(answerOptions) ? (
        <>
          <Box>{parsedResponseBody}</Box>
          <NavigationButton variant="contained" onClick={() => setIsStartPage(true)}>
            {t('tutu.aloita-alusta')}
          </NavigationButton>
        </>
      ) : (
        <>
          <AnswerOptions
            answerOptions={answerOptions}
            setCurrentObject={setCurrentObject}
            tutuConfigObjects={tutuConfigObjects}
          />
          <OphButton onClick={() => setIsStartPage(true)}>
            {t('tutu.aloita-alusta')}
          </OphButton>
        </>
      )}
    </>
  );
};
