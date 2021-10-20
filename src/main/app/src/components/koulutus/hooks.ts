import { useEffect, useMemo } from 'react';

import _ from 'lodash';
import _fp from 'lodash/fp';
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
import {
  resetJarjestajatPaging,
  setJarjestajatFilters,
  setTulevatJarjestajatFilters,
  selectJarjestajatQuery,
  setJarjestajatPaging,
  setTulevatJarjestajatPaging,
  resetTulevatJarjestajatPaging,
} from '#/src/store/reducers/koulutusSlice';

export const fetchKoulutus = async (oid?: string, isDraft: boolean = false) => {
  const koulutusData = await getKoulutus(oid, isDraft);
  if (
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM && koulutusData.ePerusteId) ||
    (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_OSAAMISALA &&
      koulutusData.ePerusteId)
  ) {
    const koulutusKuvausData = await getKoulutusKuvaus(koulutusData.ePerusteId);
    _.set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
  } else if (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA) {
    const tutkinnonOsat = koulutusData?.metadata?.tutkinnonOsat ?? [];
    const eperusteet = _.uniq(tutkinnonOsat.map((t: any) => t.ePerusteId));

    let e = [];
    for (const index in eperusteet) {
      const id = eperusteet[index];
      const eperuste = await getEperusteKuvaus(id);
      e.push(eperuste);
    }

    let yksikko = tutkinnonOsat[0]?.opintojenLaajuusyksikko;
    let pisteet = tutkinnonOsat
      .map((tutkinnonOsa: any) => tutkinnonOsa.opintojenLaajuusNumero)
      .join(' + ');

    _.set(koulutusData, 'metadata.opintojenLaajuusyksikko', yksikko);
    _.set(koulutusData, 'metadata.opintojenLaajuus', {
      nimi: {
        sv: pisteet,
        fi: pisteet,
        en: pisteet,
      },
    });

    _.set(koulutusData, 'eperusteet', e);
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
      tutkintoNimikkeet: koulutusData.metadata?.tutkintonimike,
      opintojenLaajuus: koulutusData.metadata?.opintojenLaajuus,
      opintojenLaajuusNumero: koulutusData.metadata?.opintojenLaajuusNumero,
      opintojenLaajuusyksikko: koulutusData.metadata?.opintojenLaajuusyksikko,
      koulutusTyyppi: koulutusData.metadata?.tyyppi,
      lisatiedot: koulutusData.metadata?.lisatiedot,
      teemakuva: koulutusData?.teemakuva,
      sorakuvaus: koulutusData?.sorakuvaus,
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
    () => fetchKoulutus(oid, isDraft),
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
    // Ei näytetä järjestäjälistassa sellaisia suodattimia joiden lukumäärä on 0 (niitä on paljon)
    sortedFilters: _fp.mapValues(
      _fp.pickBy((v?: { count: number }) => !_fp.isObject(v) || v.count > 0),
      data?.filters || {}
    ),
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

  // Jos filtterit muuttuu, resetoi sivutus
  useEffect(() => {
    if (filters !== previousFilters) {
      dispatch(isTuleva ? resetTulevatJarjestajatPaging() : resetJarjestajatPaging());
    }
  }, [dispatch, filters, previousFilters, isTuleva]);

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...pagination,
      ...filters,
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
      setPagination: (newPaging: any) => {
        dispatch(
          isTuleva
            ? setTulevatJarjestajatPaging(newPaging)
            : setJarjestajatPaging(newPaging)
        );
      },
      setFilters: (newFilters: any) => {
        dispatch(
          isTuleva
            ? setTulevatJarjestajatFilters(newFilters)
            : setJarjestajatFilters(newFilters)
        );
      },
    }),
    [filters, result, requestProps, isTuleva, dispatch, pagination]
  );
};