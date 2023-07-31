import { RajainItem } from '#/src/types/SuodatinTypes';
import { find } from 'lodash';
import { P, match } from 'ts-pattern';

export const isIndeterminate = (v: RajainItem): boolean =>
  match(v)
    .with(
      { checked: false, alakoodit: P.select(P.array({ checked: P.boolean })) },
      (koodit) => find(koodit, { checked: true }) !== undefined
    )
    .otherwise(() => false);