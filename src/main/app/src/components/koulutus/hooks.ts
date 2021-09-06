import _ from 'lodash';
import { useQuery } from 'react-query';

import { getEperusteKuvaus, getKoulutus, getKoulutusKuvaus } from '#/src/api/konfoApi';
import { KOULUTUS_TYYPPI } from '#/src/constants';

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

/*
type UseKoulutusJarjestajatProps = {
  oid: string;
  isTuleva?: boolean;
  isDraft?: boolean;
};

const selectJarjestajat = (response: any) => {
  const koulutus = response?.data;
  // Ei näytetä järjestäjälistassa sellaisia suodattimia joiden lukumäärä on 0 (niitä on paljon)
  const sortedFilters = _fp.mapValues(
    _fp.pickBy((v?: { count: number }) => !_fp.isObject(v) || v.count > 0),
    koulutus.jarjestajatFilters || {}
  );

  return {
    jarjestajat: koulutus.jarjestajat,
    sortedFilters,
  };
};

export const useKoulutusJarjestajat = ({
  oid,
  isTuleva = false,
  isDraft = false,
}: UseKoulutusJarjestajatProps) => {
  const dispatch = useDispatch();

  // Reset pagination when oid changes (which means that another oppilaitos-page was opened)
  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch, oid]);

  const paginationProps = useSelector((state) =>
    isTuleva ? getTulevatJarjestajatPaginationProps(state) : getJarjestajatPaginationProps(state)
  );

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...paginationProps,
    },
  };

  const result = useQuery(
    ['getPaginatedJarjestajat', fetchProps],
    () => getKoulutusJarjestajat(fetchProps)
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
*/