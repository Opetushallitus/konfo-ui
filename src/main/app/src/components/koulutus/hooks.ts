import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { set, uniq } from 'lodash';
import { useQuery } from 'react-query';

import {
  getEperusteKuvaus,
  getKoulutus,
  getKoulutusJarjestajat,
  getKoulutusKuvaus,
  getOsaamismerkki,
} from '#/src/api/konfoApi';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { useAppDispatch, useAppSelector } from '#/src/hooks/reduxHooks';
import { RootState } from '#/src/store';
import { usePreviousPage } from '#/src/store/reducers/appSlice';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { getInitialToteutusRajainValues } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  setJarjestajatRajainValues,
  selectJarjestajatQuery,
  setJarjestajatPaging,
  clearJarjestajatRajainValues,
  Pagination,
} from '#/src/store/reducers/koulutusSlice';
import { createRajainQueryParams } from '#/src/tools/rajainQueryParams';
import { KoulutusExtendedData } from '#/src/types/common';

type TutkinnonOsa = {
  ePerusteId: string;
  opintojenLaajuusyksikko: string;
  opintojenLaajuusNumero: number;
};

export const fetchKoulutus = async (
  oid: string,
  isDraft: boolean = false,
  osaamisalakuvaukset: boolean = false
) => {
  const koulutusData = await getKoulutus(oid, isDraft);

  if (
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM && koulutusData.ePerusteId) ||
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_OSAAMISALA &&
      koulutusData.ePerusteId)
  ) {
    const ePerusteId = koulutusData.ePerusteId;
    const requestParams = {
      osaamisalakuvaukset: osaamisalakuvaukset,
    };
    const koulutusKuvausData = await getKoulutusKuvaus({ ePerusteId, requestParams });
    set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
  } else if (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA) {
    const tutkinnonOsat: Array<TutkinnonOsa> =
      koulutusData?.metadata?.tutkinnonOsat ?? [];
    const ePerusteIds = uniq(tutkinnonOsat.map((t) => t.ePerusteId));

    const ePerusteet = await Promise.all(
      ePerusteIds.map((ePerusteId) => getEperusteKuvaus(ePerusteId))
    );

    const paikallisetTutkinnonOsat: Array<TutkinnonOsa> =
      koulutusData?.metadata?.paikallisetTutkinnonOsat ?? [];
    const yksikko = tutkinnonOsat[0]?.opintojenLaajuusyksikko;
    const pisteet = [...tutkinnonOsat, ...paikallisetTutkinnonOsat]
      .map((tutkinnonOsa) => tutkinnonOsa.opintojenLaajuusNumero)
      .filter(Boolean)
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
  } else if (
    koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI
  ) {
    const osaamismerkki = await getOsaamismerkki(koulutusData?.metadata?.osaamismerkki);
    set(koulutusData, 'osaamismerkki', osaamismerkki);
  }

  return koulutusData;
};

const selectKoulutus = (koulutusData: KoulutusExtendedData) => {
  if (koulutusData) {
    return {
      kuvaus: koulutusData.metadata?.kuvaus,
      linkkiEPerusteisiin: koulutusData.metadata?.linkkiEPerusteisiin,
      eperusteet: koulutusData.eperusteet,
      ePerusteId: koulutusData?.ePerusteId,
      tutkinnonOsat: koulutusData.metadata?.tutkinnonOsat,
      paikallisetTutkinnonOsat: koulutusData.metadata?.paikallisetTutkinnonOsat,
      tyotehtavatJoissaVoiToimia:
        koulutusData.metadata?.kuvaus?.tyotehtavatJoissaVoiToimia,
      suorittaneenOsaaminen: koulutusData.metadata?.kuvaus?.suorittaneenOsaaminen,
      koulutusala: koulutusData.metadata?.koulutusala,
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
      osaamismerkki: koulutusData?.osaamismerkki,
      osaamistavoitteet: koulutusData?.metadata?.osaamistavoitteet,
    };
  } else {
    return undefined;
  }
};

type UseKoulutusProps = {
  oid?: string;
  isDraft?: boolean;
  osaamisalakuvaukset?: boolean;
};

export const useKoulutus = ({
  oid,
  isDraft,
  osaamisalakuvaukset = false,
}: UseKoulutusProps) => {
  return useQuery(
    ['fetchKoulutus', { oid, isDraft, osaamisalakuvaukset }],
    () => fetchKoulutus(oid!, isDraft, osaamisalakuvaukset),
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
    rajainOptions: data?.filters || {},
  };
};

type UseKoulutusJarjestajatProps = {
  oid?: string;
  isTuleva?: boolean;
};

export const useKoulutusJarjestajat = ({
  oid,
  isTuleva = false,
}: UseKoulutusJarjestajatProps) => {
  const dispatch = useAppDispatch();

  const requestProps = useAppSelector((state: RootState) =>
    selectJarjestajatQuery(state, isTuleva)
  );
  const { pagination, rajainValues } = requestProps;

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten + Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  const initialRajainValues = useAppSelector(getInitialToteutusRajainValues);

  const setPagination = useCallback(
    (newPaging: Pagination) => {
      dispatch(setJarjestajatPaging({ isTuleva, pagination: newPaging }));
    },
    [isTuleva, dispatch]
  );

  const setRajainValues = useCallback(
    (newValues: Partial<RajainValues>) => {
      dispatch(setJarjestajatRajainValues({ isTuleva, rajainValues: newValues }));
    },
    [isTuleva, dispatch]
  );

  const clearRajainValues = useCallback(() => {
    dispatch(clearJarjestajatRajainValues({ isTuleva }));
  }, [isTuleva, dispatch]);

  const [initialValues] = useState(initialRajainValues);

  const previousPage = usePreviousPage();

  const hasSetInitialFilters = useRef(false);

  useEffect(() => {
    if (previousPage === 'haku' && !hasSetInitialFilters.current) {
      setRajainValues(initialValues);
      setPagination({ offset: 0 });
      hasSetInitialFilters.current = true;
    }
  }, [oid, setRajainValues, initialValues, previousPage, setPagination]);

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...pagination,
      ...createRajainQueryParams(rajainValues),
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
    (): any => ({
      queryResult: result,
      queryOptions: requestProps,
      rajainValues: rajainValues,
      pagination,
      setPagination,
      setRajainValues,
      clearRajainValues,
    }),
    [
      rajainValues,
      setRajainValues,
      result,
      requestProps,
      pagination,
      setPagination,
      clearRajainValues,
    ]
  );
};
