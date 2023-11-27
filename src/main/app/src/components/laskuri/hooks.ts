import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { getHaku, getKoodistonKoodit } from '#/src/api/konfoApi';
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

interface HakukohteenToteutus {
  oid: string;
}

interface HakukohteenOrganisaatio {
  nimi: Translateable;
}

export interface HaunHakukohde {
  oid: string;
  nimi: Translateable;
  toteutus: HakukohteenToteutus;
  organisaatio: HakukohteenOrganisaatio;
}

export interface Haku {
  hakukohteet: Array<HaunHakukohde>;
}

export const useGetHaku = ({ oid, isDraft }: { oid: string; isDraft: boolean }) => {
  return useQuery<Haku>(['getHaku', { oid, isDraft }], () => getHaku(oid, isDraft), {
    select: selectToteutus,
    enabled: Boolean(oid),
  });
};
