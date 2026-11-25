import { Box, Typography } from '@mui/material';
import { OphButton, OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';

import { Dispatch, useState } from 'react';
import { LanguageCode } from '#/src/types/common';
import { useLanguageState } from '#/src/hooks';
import { isEmpty } from 'lodash-es';
import parse, { Element, DOMNode, domToReact, Text } from 'html-react-parser';
import { TutuObject } from '../types';
import { NavigationButton } from '../components/NavigationButton';
import { AnswerOptions } from '../components/AnswerOptions';
import { ExternalLink } from '../../common/ExternalLink';
import { useTheme } from '@mui/system';

const OPINTOPOLKU_DOMAINS = ['opintopolku.fi', 'studieinfo.fi', 'studyinfo.fi'];
const isOneOfOpintopolkuDomains = (domNode: Element) => {
  return OPINTOPOLKU_DOMAINS.some((domain: string) =>
    domNode?.attribs?.href?.includes(domain)
  );
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
  const parsedBody = parse(translation?.body || '', {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'a') {
        if (domNode?.attribs?.href?.startsWith('/node')) {
          domNode.attribs.href = `https://oph.fi/${language}${domNode.attribs.href}`;
        }

        if (isOneOfOpintopolkuDomains(domNode)) {
          domNode.attribs.href = `/konfo/${language}`;
          domNode.attribs.target = '';
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
            onClick={() => setIsStartPage(true)}
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
          <OphButton onClick={() => setIsStartPage(true)}>
            {t('tutu.aloita-alusta')}
          </OphButton>
        </>
      )}
    </>
  );
};
