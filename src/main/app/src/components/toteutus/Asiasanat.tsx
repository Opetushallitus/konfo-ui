import React, { useState } from 'react';

import { Box, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { TextButton } from '#/src/components/common/TextButton';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';

const getAsiasanatForLanguage = (asiasanat: Array<any>, language: string) => {
  const getFirstNotEmpty = (
    asiasanat1: Array<any>,
    asiasanat2: Array<any>,
    asiasanat3: Array<any>
  ) => {
    const returnIfNotEmpty = (arr: Array<any>) => {
      if (arr?.length > 0) return arr;
    };
    return (
      returnIfNotEmpty(asiasanat1) ||
      returnIfNotEmpty(asiasanat2) ||
      returnIfNotEmpty(asiasanat3) ||
      []
    );
  };
  const filterAsiasanatForLang = (arr: Array<any>, language: string) => {
    return arr?.filter((asiasana: any) => asiasana.kieli === language);
  };

  const fi = filterAsiasanatForLang(asiasanat, 'fi');
  const sv = filterAsiasanatForLang(asiasanat, 'sv');
  const en = filterAsiasanatForLang(asiasanat, 'en');

  if ('en' === language) {
    return getFirstNotEmpty(en, fi, sv);
  } else if ('sv' === language) {
    return getFirstNotEmpty(sv, fi, en);
  } else {
    return getFirstNotEmpty(fi, sv, en);
  }
};

const UNEXPANDED_ASIASANA_LIMIT = 10;

export const useVisibleAsiasanat = (asiasanat: Array<string>, isExpanded: boolean) => {
  if (isExpanded) {
    return asiasanat;
  } else {
    return asiasanat.slice(0, UNEXPANDED_ASIASANA_LIMIT);
  }
};

const AsiasanatExpander = ({
  translatedAsiasanat,
}: {
  translatedAsiasanat: Array<string>;
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(
    translatedAsiasanat?.length <= UNEXPANDED_ASIASANA_LIMIT
  );

  const visibleAsiasanat = useVisibleAsiasanat(translatedAsiasanat, isExpanded);

  return (
    <Box mt={4}>
      <Grid alignItems="center" justifyContent="center" container spacing={1}>
        {visibleAsiasanat.map((asiasana: string) => (
          <Grid item key={asiasana}>
            <TextWithBackground>{asiasana}</TextWithBackground>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" alignItems="center" justifyContent="center" height="1rem">
        {!isExpanded && (
          <TextButton
            onClick={() => setIsExpanded(true)}
            style={{ fontSize: '0.8rem', lineHeight: '1rem' }}>
            {t('toteutus.nayta-enemman')}
          </TextButton>
        )}
      </Box>
    </Box>
  );
};

export const Asiasanat = ({ toteutus }: { toteutus: any }) => {
  const { asiasanat, ammattinimikkeet } = toteutus?.metadata ?? {};

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // NOTE: These ammattinimikkeet should be the freely written virkailija asiasana-ammattinimikkeet,
  // not the formal tutkintonimikkeet
  const translatedAsiasanat: Array<string> = getAsiasanatForLanguage(
    (ammattinimikkeet || []).concat(asiasanat || []),
    currentLanguage
  )?.map((asiasana: any) => asiasana.arvo);

  return translatedAsiasanat?.length > 0 ? (
    <AsiasanatExpander translatedAsiasanat={translatedAsiasanat} />
  ) : null;
};
