import { LanguageCode } from '#/src/types/common';

const isValidLanguage = (language?: string): language is LanguageCode =>
  language === 'fi' || language === 'sv' || language === 'en';

import { TutuObject, TutuTranslation } from './types';

// Kaikkia oppaan kohtia ei välttämättä ole käännetty kaikille kielille, joten käytetään
// tarvittaessa suomenkielistä käännöstä.
export const getTutuTranslation = (
  tutuObject: TutuObject | undefined,
  language?: string
): TutuTranslation | undefined =>
  isValidLanguage(language)
    ? tutuObject?.translations[language]
    : tutuObject?.translations.fi;
