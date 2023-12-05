import { t } from 'i18next';
import { isEmpty } from 'lodash';

import { localize } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

import { VertailuList } from './VertailuList';

export const VertailuKoodiLista = ({ koodit }: { koodit?: Array<{ koodi: Koodi }> }) =>
  isEmpty(koodit) ? (
    t('suosikit-vertailu.ei-maaritelty')
  ) : (
    <VertailuList>
      {koodit?.map((k) => <li key={k?.koodi?.koodiUri}>{localize(k?.koodi?.nimi)}</li>)}
    </VertailuList>
  );
