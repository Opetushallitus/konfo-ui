import { findKey } from 'lodash';

import { SlugIdData, SlugsToIds } from '../types/common';

/* Resolve new slug via id in case language is changed. Also tries to handle language changes
 * from fi/sv space to en space via optional Contentful field englishPageVersionId */
export const resolveNewSlug = (
  slugsToIds: SlugsToIds,
  idInfo: SlugIdData,
  lngParam: string
): string | undefined => {
  const defaultSpaceLanguages = ['fi', 'sv'];
  const idLng = idInfo?.language;

  if (!idLng) {
    return undefined;
  }

  // Navigating from fi->sv or sv->fi
  if (defaultSpaceLanguages.includes(idLng) && defaultSpaceLanguages.includes(lngParam)) {
    return findKey(
      slugsToIds,
      (slugInfo) => slugInfo.id === idInfo?.id && slugInfo?.language === lngParam
    );
  }
  // Navigating from fi/sv -> en
  else if (
    defaultSpaceLanguages.includes(idLng) &&
    lngParam === 'en' &&
    idInfo?.englishPageVersionId
  ) {
    return findKey(
      slugsToIds,
      (slugInfo) =>
        slugInfo.id === idInfo?.englishPageVersionId && slugInfo?.language === lngParam
    );
  }
  // Navigating from en -> fi/sv
  else if (idLng === 'en' && defaultSpaceLanguages.includes(lngParam)) {
    return findKey(
      slugsToIds,
      (slugInfo) =>
        slugInfo.englishPageVersionId === idInfo?.id && slugInfo?.language === lngParam
    );
  } else {
    return undefined;
  }
};
