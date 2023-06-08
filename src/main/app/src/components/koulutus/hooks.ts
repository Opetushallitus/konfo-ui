import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { set, uniq, omit, mapValues } from 'lodash';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import {
  getEperusteKuvaus,
  getKoulutus,
  getKoulutusJarjestajat,
  getKoulutusKuvaus,
} from '#/src/api/konfoApi';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { usePreviousNonEmpty } from '#/src/hooks';
import { usePreviousPage } from '#/src/store/reducers/appSlice';
import { getInitialCheckedToteutusFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  resetJarjestajatPaging,
  setJarjestajatFilters,
  setTulevatJarjestajatFilters,
  selectJarjestajatQuery,
  setJarjestajatPaging,
  setTulevatJarjestajatPaging,
  resetTulevatJarjestajatPaging,
} from '#/src/store/reducers/koulutusSlice';

type TutkinnonOsa = {
  ePerusteId: string;
  opintojenLaajuusyksikko: string;
  opintojenLaajuusNumero: number;
};

export const fetchKoulutus = async (oid: string, isDraft: boolean = false) => {
  const koulutusData = await getKoulutus(oid, isDraft);
  if (
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM && koulutusData.ePerusteId) ||
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_OSAAMISALA &&
      koulutusData.ePerusteId)
  ) {
    const koulutusKuvausData = await getKoulutusKuvaus(koulutusData.ePerusteId);
    set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
  } else if (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA) {
    const tutkinnonOsat: Array<TutkinnonOsa> =
      koulutusData?.metadata?.tutkinnonOsat ?? [];
    const ePerusteIds = uniq(tutkinnonOsat.map((t) => t.ePerusteId));

    const ePerusteet = await Promise.all(
      ePerusteIds.map((ePerusteId) => getEperusteKuvaus(ePerusteId))
    );

    const yksikko = tutkinnonOsat[0]?.opintojenLaajuusyksikko;
    const pisteet = tutkinnonOsat
      .map((tutkinnonOsa) => tutkinnonOsa.opintojenLaajuusNumero)
      .join(' + ');

    set(koulutusData, 'metadata.opintojenLaajuusyksikko', yksikko);
    set(koulutusData, 'metadata.opintojenLaajuus', {
      nimi: {
        sv: pisteet,
        fi: pisteet,
        en: pisteet,
      },
    });

    set(koulutusData, 'eperusteet', ePerusteet);
  }
  return koulutusData;
};

const selectKoulutus = (koulutusData: any) => {
  if (koulutusData) {
    return {
      kuvaus: koulutusData.metadata?.kuvaus,
      linkkiEPerusteisiin: koulutusData.metadata?.linkkiEPerusteisiin,
      eperusteet: koulutusData.eperusteet,
      ePerusteId: koulutusData?.ePerusteId,
      tutkinnonOsat: koulutusData.metadata?.tutkinnonOsat,
      tyotehtavatJoissaVoiToimia:
        koulutusData.metadata?.kuvaus?.tyotehtavatJoissaVoiToimia,
      suorittaneenOsaaminen: koulutusData.metadata?.kuvaus?.suorittaneenOsaaminen,
      koulutusAla: koulutusData.metadata?.koulutusala,
      tutkintoNimi: koulutusData?.nimi,
      tutkintonimikkeet: koulutusData.metadata?.tutkintonimike,
      opintojenLaajuus: koulutusData.metadata?.opintojenLaajuus,
      opintojenLaajuusNumero: koulutusData.metadata?.opintojenLaajuusNumero,
      opintojenLaajuusNumeroMin: koulutusData.metadata?.opintojenLaajuusNumeroMin,
      opintojenLaajuusNumeroMax: koulutusData.metadata?.opintojenLaajuusNumeroMax,
      opintojenLaajuusyksikko: koulutusData.metadata?.opintojenLaajuusyksikko,
      koulutustyyppi: koulutusData.metadata?.tyyppi,
      lisatiedot: koulutusData.metadata?.lisatiedot,
      teemakuva: koulutusData?.teemakuva,
      sorakuvaus: koulutusData?.sorakuvaus,
      eqf: koulutusData?.eqf,
      nqf: koulutusData?.nqf,
      isAvoinKorkeakoulutus: koulutusData?.metadata?.isAvoinKorkeakoulutus,
      tunniste: koulutusData?.metadata?.tunniste, // Avoin-kk "hakijalle näkyvä tunniste"
      opinnonTyyppi: koulutusData?.metadata?.opinnonTyyppi, // Avoin-kk
    };
  } else {
    return undefined;
  }
};

type UseKoulutusProps = {
  oid?: string;
  isDraft?: boolean;
};

export const useKoulutus = ({ oid, isDraft }: UseKoulutusProps) => {
  return useQuery(
    ['fetchKoulutus', { oid, isDraft }],
    () => fetchKoulutus(oid!, isDraft),
    {
      select: selectKoulutus,
      enabled: Boolean(oid),
    }
  );
};

const selectJarjestajat = (data: any) => {
  return {
    total: data?.total,
    jarjestajat: data?.hits,
    sortedFilters: data?.filters || {},
  };
};

type UseKoulutusJarjestajatProps = {
  oid: string;
  isTuleva?: boolean;
};

export const useKoulutusJarjestajat = ({
  oid,
  isTuleva = false,
}: UseKoulutusJarjestajatProps) => {
  const dispatch = useDispatch();

  const requestProps = useSelector(selectJarjestajatQuery(isTuleva));
  const { pagination = {}, filters = {} } = requestProps;
  const previousFilters = usePreviousNonEmpty(filters);

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten + Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getInitialCheckedToteutusFilters
  );

  const setPagination = useCallback(
    (newPaging: any) => {
      dispatch(
        isTuleva
          ? setTulevatJarjestajatPaging(newPaging)
          : setJarjestajatPaging(newPaging)
      );
    },
    [isTuleva, dispatch]
  );

  const setFilters = useCallback(
    (newFilters: any) => {
      dispatch(
        isTuleva
          ? setTulevatJarjestajatFilters(newFilters)
          : setJarjestajatFilters(newFilters)
      );
    },
    [isTuleva, dispatch]
  );

  const [initialValues] = useState(initialCheckedFilters);

  const previousPage = usePreviousPage();

  const hasSetInitialFilters = useRef(false);

  useEffect(() => {
    if (previousPage === 'haku' && !hasSetInitialFilters.current) {
      setFilters(initialValues);
      setPagination({ offset: 0 });
      hasSetInitialFilters.current = true;
    }
  }, [oid, setFilters, initialValues, previousPage, setPagination]);

  const createQueryParams = (values: Record<string, Array<string> | boolean>) => {
    // TODO: konfo-backend haluaa maakunta ja kunta -rajainten sijaan "sijainti" -rajaimen, pitäisi refaktoroida sinne maakunta + kunta käyttöön
    const valuesWithSijainti = omit(
      {
        ...values,
        sijainti: [
          ...((values.maakunta as Array<string>) ?? []),
          ...((values.kunta as Array<string>) ?? []),
        ],
      },
      ['maakunta', 'kunta', 'koulutusala', 'koulutustyyppi', 'koulutustyyppi-muu']
    );

    return mapValues(valuesWithSijainti, (v: Array<string> | string) =>
      Array.isArray(v) ? v!.join(',') : v!.toString()
    );
  };

  // Jos filtterit muuttuu, resetoi sivutus
  useEffect(() => {
    if (filters !== previousFilters && previousFilters !== undefined) {
      dispatch(isTuleva ? resetTulevatJarjestajatPaging() : resetJarjestajatPaging());
    }
  }, [dispatch, filters, previousFilters, isTuleva]);

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...pagination,
      ...createQueryParams(filters),
    },
  };

  const result = useQuery(
    ['getKoulutusJarjestajat', fetchProps],
    () => getKoulutusJarjestajat(fetchProps),
    {
      enabled: Boolean(oid),
      keepPreviousData: true,
      staleTime: 60 * 1000,
      select: selectJarjestajat,
    }
  );

  return useMemo(
    () => ({
      queryResult: result,
      queryOptions: requestProps,
      filters,
      pagination,
      setPagination,
      setFilters,
    }),
    [filters, setFilters, result, requestProps, pagination, setPagination]
  );
};
