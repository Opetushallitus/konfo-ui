import { useEffect, useMemo } from 'react';

import { filter, map, size, compact } from 'lodash';
import { useQueries, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import {
  getKoodistonKoodit,
  getOppilaitos,
  getOppilaitosOsa,
  getOppilaitosTarjonta,
} from '#/src/api/konfoApi';
import {
  setTarjontaPagination,
  setTulevaTarjontaPagination,
  resetPagination,
} from '#/src/store/reducers/oppilaitosSlice';
import {
  getTarjontaPaginationProps,
  getTulevaTarjontaPaginationProps,
} from '#/src/store/reducers/oppilaitosSliceSelector';
import {
  localize,
  localizeArrayToCommaSeparated,
  getLocalizedMaksullisuus,
} from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { Koodi } from '#/src/types/common';
import { Organisaatio } from '#/src/types/ToteutusTypes';

const removeOppilaitosName = (osaName: string, oppilaitosName: string) =>
  osaName.replace(`${oppilaitosName}, `, '');

const ACTIVE = 'AKTIIVINEN';

const handleOppilaitosData = (
  isOppilaitosOsa: boolean,
  data: any,
  rest: Omit<ReturnType<typeof useQuery>, 'data'>
) => {
  const entity = isOppilaitosOsa ? data.oppilaitoksenOsa : (data.oppilaitos ?? {});
  const aktiivisetOsat = filter(data?.osat, { status: ACTIVE });
  return {
    data: {
      ...data,
      ...entity,
      oppilaitosOsat: isOppilaitosOsa
        ? data?.parentToimipisteOid
          ? compact([
              data?.oppilaitos?.osat?.find(
                (osa: Organisaatio) => osa.oid === data?.parentToimipisteOid
              ),
            ])
          : undefined
        : map(aktiivisetOsat, (osa: any) => ({
            ...osa,
            nimi: removeOppilaitosName(localize(osa.nimi), localize(data.nimi)),
          })),
      esittelyHtml: localize(entity?.metadata?.esittely) ?? '',
      tietoaOpiskelusta: entity?.metadata?.tietoaOpiskelusta ?? [],
      kotipaikat:
        aktiivisetOsat.length > 0
          ? aktiivisetOsat.map((osa: any) => osa?.kotipaikka)
          : [data?.kotipaikka],
    },
    ...rest,
  };
};

type UseOppilaitosProps = {
  oid: string;
  isOppilaitosOsa: boolean;
  isDraft?: boolean;
};

export const useOppilaitos = ({ oid, isOppilaitosOsa, isDraft }: UseOppilaitosProps) => {
  const { data = {}, ...rest } = useQuery(
    ['getOppilaitos', { oid, isOppilaitosOsa, isDraft }],
    () => (isOppilaitosOsa ? getOppilaitosOsa(oid, isDraft) : getOppilaitos(oid, isDraft))
  );
  return useMemo(
    () => handleOppilaitosData(isOppilaitosOsa, data, rest),
    [isOppilaitosOsa, data, rest]
  );
};

type UseOppilaitoksetProps = {
  oids: Array<string>;
  isOppilaitosOsa: boolean;
  isDraft?: boolean;
};

export const useOppilaitokset = ({
  oids,
  // TODO: Poista isOppilaitosOsa-parametri ja refaktoroi oppilaitosten/osien käsittely järkevämmäksi.
  isOppilaitosOsa,
  isDraft,
}: UseOppilaitoksetProps) => {
  const results = useQueries(
    oids.map((oid) => ({
      queryKey: ['getOppilaitos', { oid, isDraft }],
      // NOTE: getOppilaitos palauttaa myös oppilaitoksen osia, jos oideilla niitä löytyy
      queryFn: () => getOppilaitos(oid, isDraft),
      refetchOnMount: false,
      retryOnMount: false,
    }))
  );

  return useMemo(
    () =>
      results.map(({ data = {}, ...rest }) =>
        handleOppilaitosData(isOppilaitosOsa, data, rest)
      ),
    [isOppilaitosOsa, results]
  );
};

type UsePaginatedTarjontaProps = {
  oid: string;
  isOppilaitosOsa: boolean;
  isTuleva?: boolean;
};

const selectTarjonta = (tarjonta: any) => {
  return {
    values: map(tarjonta?.hits, (t: any) => ({
      toteutusName: localize(t.nimi),
      description: localize(t.kuvaus),
      locations: localizeArrayToCommaSeparated(t.kunnat, { sorted: true }),
      opetustapa: localizeArrayToCommaSeparated(t.opetusajat, { sorted: true }),
      price: getLocalizedMaksullisuus(t.maksullisuustyyppi, t.maksunMaara),
      tyyppi: t.koulutustyyppi,
      kuva: t.kuva,
      toteutusOid: t.toteutusOid,
      jarjestaaUrheilijanAmmKoulutusta: t.jarjestaaUrheilijanAmmKoulutusta,
    })),
    hasHits: size(tarjonta?.hits) > 0,
    total: tarjonta?.total,
  };
};

const selectTulevaTarjonta = (tulevaTarjonta: any) => {
  const hits = tulevaTarjonta?.hits ?? [];
  const total = tulevaTarjonta?.total ?? 0;
  const localizedTulevaTarjonta = hits.map((k: any) => ({
    koulutusOid: k.koulutusOid,
    koulutusName: localize(k.nimi),
    tutkintonimikkeet: localizeArrayToCommaSeparated(k.tutkintonimikkeet, {
      sorted: true,
    }),
    koulutustyypit: localizeArrayToCommaSeparated(k.koulutustyypit, { sorted: true }),
    opintojenlaajuus: getLocalizedOpintojenLaajuus(undefined, k),
    tyyppi: k.koulutustyyppi,
  }));

  return { values: localizedTulevaTarjonta, total };
};

export const usePaginatedTarjonta = ({ oid, isTuleva }: UsePaginatedTarjontaProps) => {
  const dispatch = useDispatch();

  // Reset pagination when oid changes (which means that another oppilaitos-page was opened)
  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch, oid]);

  const paginationProps = useSelector((state) =>
    isTuleva ? getTulevaTarjontaPaginationProps(state) : getTarjontaPaginationProps(state)
  );

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...paginationProps,
    },
  };

  const result = useQuery(
    ['getPaginatedTarjonta', fetchProps],
    () => getOppilaitosTarjonta(fetchProps),
    {
      enabled: Boolean(oid),
      keepPreviousData: true,
      staleTime: 60 * 1000,
      select: (tarjontaData: any) =>
        isTuleva ? selectTulevaTarjonta(tarjontaData) : selectTarjonta(tarjontaData),
    }
  );

  return useMemo(
    () => ({
      queryResult: result,
      pagination: paginationProps,
      setPagination: (newPagination: any) => {
        dispatch(
          isTuleva
            ? setTulevaTarjontaPagination({ ...paginationProps, ...newPagination })
            : setTarjontaPagination({ ...paginationProps, ...newPagination })
        );
      },
    }),
    [result, paginationProps, isTuleva, dispatch]
  );
};

export const useSomeKoodit = () => {
  const { data } = useQuery<Array<Koodi>>(
    ['getKoodistonKooditSome'],
    () => getKoodistonKoodit('sosiaalinenmedia'),
    { staleTime: Infinity }
  );
  return useMemo(() => {
    return data;
  }, [data]);
};
