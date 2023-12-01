import { isEmpty } from 'lodash';

import { localize } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';

import { List } from './VertailuValintakokeet';

export const VertailuKoodiLista = ({ koodit }: { koodit: Array<{ koodi: Koodi }> }) =>
  isEmpty(koodit) ? null : (
    <List>
      {koodit?.map((k) => <li key={k?.koodi?.koodiUri}>{localize(k?.koodi?.nimi)}</li>)}
    </List>
  );
