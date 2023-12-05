import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { getKoodistonKoodit, searchHakukohteet } from '#/src/api/konfoApi';
import { translate } from '#/src/tools/localization';
import { HakukohdeSearchParams, Koodi } from '#/src/types/common';

export const useKieliKoodit = () => {
  const { data } = useQuery<Array<Koodi>>(
    ['getKoodistonKooditKielivalikoima'],
    () => getKoodistonKoodit('kielivalikoima'),
    { staleTime: Infinity }
  );
  return useMemo(() => {
    return data?.sort((a: Koodi, b: Koodi) => {
      const aName = translate(a.nimi).toLowerCase();
      const bName = translate(b.nimi).toLowerCase();
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });
  }, [data]);
};

export const useHakukohdeSearch = (requestParams: HakukohdeSearchParams) =>
  useQuery([requestParams], ({ signal }) => searchHakukohteet(requestParams, signal), {});
