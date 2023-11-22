import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { getKoodistonKoodit, getToteutuksetKoulutuksittain } from '#/src/api/konfoApi';
import { selectToteutus } from '#/src/components/toteutus/hooks';
import { translate } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

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

interface ToteutusHit {
  toteutusOid: string;
  toteutusNimi: Translateable;
  oppilaitosNimi: Translateable;
}

interface ToteutuksetKoulutuksittainHit {
  toteutukset: Array<ToteutusHit>;
}

export interface ToteutuksetKoulutuksittainResult {
  total: number;
  hits: Array<ToteutuksetKoulutuksittainHit>;
}

export const useToteutuksetKoulutuksittain = ({
  keyword,
  searchLanguage = 'fi',
}: {
  keyword: string;
  searchLanguage: 'fi' | 'sv' | 'en';
}) => {
  return useQuery<ToteutuksetKoulutuksittainResult>(
    ['toteutuksetKoulutuksittain', { keyword }],
    () => getToteutuksetKoulutuksittain(keyword, searchLanguage),
    {
      select: selectToteutus,
      enabled: Boolean(keyword),
    }
  );
};
