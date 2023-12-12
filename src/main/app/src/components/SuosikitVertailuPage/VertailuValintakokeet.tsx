import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { VertailuSuosikki } from '#/src/types/common';

import { VertailuList } from './VertailuList';

export const VertailuValintakokeet = ({
  valintakokeet,
}: {
  valintakokeet: VertailuSuosikki['valintakokeet'];
}) => {
  const { t } = useTranslation();

  return isEmpty(valintakokeet) ? (
    t('suosikit-vertailu.ei-valintakokeita')
  ) : (
    <VertailuList>
      {valintakokeet.map((valintakoe) => (
        <li key={valintakoe.id}>{localize(valintakoe)}</li>
      ))}
    </VertailuList>
  );
};
