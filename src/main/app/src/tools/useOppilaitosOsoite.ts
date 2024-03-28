import { isEmpty } from 'lodash';
import { useQuery } from 'react-query';

import { getOppilaitos, getOppilaitosOsa } from '#/src/api/konfoApi';
import { parseOsoiteData } from '#/src/tools/utils';
import { Yhteystiedot } from '#/src/types/common';

export interface OppilaitosOsoite {
  oppilaitosOid: string;
  yhteystiedot: string;
  hakijapalveluidenYhteystiedot?: Yhteystiedot;
}

const fetchOppilaitosOsoitteet = async (oppilaitosOids: Array<string>) => {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOids.filter(Boolean).map((oid) => getOppilaitos(oid))
  );

  return oppilaitosDatas.map((data) => {
    const hakijapalvelutData =
      data.oppilaitos?.metadata.hakijapalveluidenYhteystiedot ?? null;

    const yhteystiedot = data.oppilaitos?.metadata?.yhteystiedot;

    return {
      oppilaitosOid: data.oid,
      yhteystiedot: isEmpty(yhteystiedot) ? {} : parseOsoiteData(yhteystiedot),
      hakijapalveluidenYhteystiedot:
        hakijapalvelutData && parseOsoiteData(hakijapalvelutData),
    };
  });
};

const fetchOppilaitosOsaOsoitteet = async (oppilaitosOsaOids: Array<string>) => {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOsaOids.filter(Boolean).map((oid) => getOppilaitosOsa(oid))
  );

  return oppilaitosDatas.map((data) => {
    // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
    const osoiteData =
      (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos)?.metadata.yhteystiedot ??
      null;

    return {
      oppilaitosOid: data.oid,
      yhteystiedot: osoiteData && parseOsoiteData(osoiteData).yhteystiedot,
    };
  });
};

export const useOsoitteet = (
  oppilaitosOids: Array<string>,
  isOppilaitosOsa?: boolean
) => {
  const { data: osoitteet = [], ...rest } = useQuery(
    ['getOppilaitosOsoitteet', oppilaitosOids],
    () =>
      isOppilaitosOsa
        ? fetchOppilaitosOsaOsoitteet(oppilaitosOids)
        : fetchOppilaitosOsoitteet(oppilaitosOids),
    {
      refetchOnWindowFocus: false,
      retryOnMount: false,
    }
  );

  return { osoitteet, ...rest } as any;
};
