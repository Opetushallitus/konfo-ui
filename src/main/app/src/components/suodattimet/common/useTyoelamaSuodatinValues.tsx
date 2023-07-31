import { useMemo } from 'react';

import { FILTER_TYPES } from '#/src/constants';

import { useFilterProps } from '../../haku/hakutulosHooks';

export const useTyoelamaSuodatinValues = () => {
  const jotpa = useFilterProps(FILTER_TYPES.JOTPA);
  const tyovoimakoulutus = useFilterProps(FILTER_TYPES.TYOVOIMAKOULUTUS);
  const taydennyskoulutus = useFilterProps(FILTER_TYPES.TAYDENNYSKOULUTUS);

  return useMemo(
    () => [...jotpa, ...taydennyskoulutus, ...tyovoimakoulutus],
    [jotpa, tyovoimakoulutus, taydennyskoulutus]
  );
};
