import { RajainUIItem, RajainUIBaseItem } from '#/src/types/SuodatinTypes';

export const isIndeterminate = (v: RajainUIItem) =>
  !v.checked &&
  Boolean(v.alakoodit?.some((alakoodi: RajainUIBaseItem) => alakoodi.checked));
