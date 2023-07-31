import { find } from 'lodash';
import { P, match } from 'ts-pattern';

import { RajainItem } from '#/src/types/SuodatinTypes';

export const isIndeterminate = (v: RajainItem): boolean =>
  match(v)
    .with(
      { checked: false, alakoodit: P.select(P.array({ checked: P.boolean })) },
      (koodit) => find(koodit, { checked: true }) !== undefined
    )
    .otherwise(() => false);
