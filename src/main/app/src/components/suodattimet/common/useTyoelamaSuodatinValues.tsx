import { useMemo } from 'react';

import { FILTER_TYPES } from '#/src/constants';
import { RajainType } from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../../haku/hakutulosHooks';

export const useTyoelamaSuodatinValues = () => {
  const jotpa = useFilterProps(FILTER_TYPES.JOTPA);
  const tyovoimakoulutus = useFilterProps(FILTER_TYPES.TYOVOIMAKOULUTUS);
  const taydennyskoulutus = useFilterProps(FILTER_TYPES.TAYDENNYSKOULUTUS);

  return useMemo(
    () => ({
      rajainType: RajainType.BOOLEAN,
      values: [...jotpa.values, ...taydennyskoulutus.values, ...tyovoimakoulutus.values],
    }),
    [jotpa, tyovoimakoulutus, taydennyskoulutus]
  );
};
