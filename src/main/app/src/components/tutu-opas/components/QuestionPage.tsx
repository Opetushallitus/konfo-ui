import { Box, Typography } from '@mui/material';
import { OphButton, OphLink, OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';

import { Dispatch, useState } from 'react';
import { LanguageCode } from '#/src/types/common';
import { useLanguageState } from '#/src/hooks';
import { isEmpty } from 'lodash-es';
import { useTheme } from '@mui/system';
import parse, { Element, DOMNode, domToReact, Text } from 'html-react-parser';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { isAbsoluteKonfoUrl } from '#/src/components/common/localizeHref';
import { SmartLink } from '#/src/components/common/SmartLink';
import { NavigationButton } from '../components/NavigationButton';
import { AnswerOptions } from '../components/AnswerOptions';
import { TutuObject } from '../types';

const parseTranslationBody = (language: LanguageCode, translationBody: string) => {
  return parse(translationBody, {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'a') {
        if (domNode?.attribs?.href?.startsWith('/node')) {
          domNode.attribs.href = `https://oph.fi/${language}${domNode.attribs.href}`;
        }

        // SmartLink muuttaa absoluuttiset Konfo-linkit sovelluksen sisäisiksi poluiksi.
        if (isAbsoluteKonfoUrl(domNode.attribs.href)) {
          return (
            <OphLink
              component={SmartLink}
              href={domNode.attribs.href}
              iconVisible={false}
              variant="body1">
              {domToReact(domNode.children as Array<Text>)}
            </OphLink>
          );
        } else {
          return (
            <ExternalLink href={domNode.attribs.href}>
              {domToReact(domNode.children as Array<Text>)}
            </ExternalLink>
          );
        }
      }
    },
  });
};

export const QuestionPage = ({
  setIsStartPage,
  tutuConfigObjects,
}: {
  setIsStartPage: Dispatch<boolean>;
  tutuConfigObjects: Array<TutuObject>;
}) => {
  const [lng] = useLanguageState();
  const { t } = useTranslation();
  const theme = useTheme();

  const frontPageObject = tutuConfigObjects.find((obj: TutuObject) => obj.is_frontpage);
  const [currentObject, setCurrentObject] = useState<TutuObject | undefined>(
    frontPageObject
  );

  const language = lng ?? 'fi';
  const translation = currentObject?.translations[language as LanguageCode];
  const answerOptions = translation?.answers;
  const parsedBody = parseTranslationBody(
    language as LanguageCode,
    translation?.body || ''
  );

  const goBackToStart = () => {
    setIsStartPage(true);
    window.scrollTo(0, 0);
  };

  const optionsLabelId = 'valitse-yksi-label';
  return (
    <>
      <OphTypography variant="h1" sx={{ marginBottom: theme.spacing(3) }}>
        {translation?.question}
      </OphTypography>

      {isEmpty(answerOptions) ? (
        <>
          <Box>{parsedBody}</Box>
          <NavigationButton
            variant="contained"
            onClick={goBackToStart}
            sx={{ marginTop: theme.spacing(1.5) }}>
            {t('tutu.aloita-alusta')}
          </NavigationButton>
        </>
      ) : (
        <>
          <Box>{parsedBody}</Box>
          <Typography id={optionsLabelId} sx={{ marginBottom: theme.spacing(2) }}>
            {t('tutu.tutu-opas.valitse-yksi')}
          </Typography>
          <AnswerOptions
            answerOptions={answerOptions}
            setCurrentObject={setCurrentObject}
            tutuConfigObjects={tutuConfigObjects}
            labelId={optionsLabelId}
          />
          <OphButton onClick={goBackToStart}>{t('tutu.aloita-alusta')}</OphButton>
        </>
      )}
    </>
  );
};
