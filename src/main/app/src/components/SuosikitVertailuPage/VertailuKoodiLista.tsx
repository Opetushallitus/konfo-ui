import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

import { VertailuList } from './VertailuList';

export const VertailuKoodiLista = ({
  koodit,
  emptyText,
}: {
  koodit?: Array<{ koodi: Koodi }>;
  emptyText?: string;
}) => {
  const { t } = useTranslation();
  return isEmpty(koodit) ? (
    emptyText ?? t('suosikit-vertailu.ei-maaritelty')
  ) : (
    <VertailuList>
      {koodit?.map((k) => <li key={k?.koodi?.koodiUri}>{localize(k?.koodi?.nimi)}</li>)}
    </VertailuList>
  );
};
