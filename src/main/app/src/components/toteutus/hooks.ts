import _fp from 'lodash/fp';
import { useQuery } from 'react-query';

import { getToteutus } from '#/src/api/konfoApi';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { isHakuAuki, isHakuTimeRelevant } from '#/src/tools/hakuaikaUtils';
import { Translateable } from '#/src/types/common';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { demoLinksPerLomakeId } from './utils';

const getHakuAukiType = (toteutus: any) => {
  if (toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.EI_SAHKOISTA) {
    return null;
  }
  if (toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.MUU) {
    return isHakuAuki([toteutus.metadata.hakuaika]) ? 'ilmoittautuminen' : null;
  }

  const hakuKohdeAuki = toteutus.hakutiedot
    ?.map((hakutieto: any) => hakutieto.hakukohteet)
    .flat()
    .some((hakukohde: any) => isHakuAuki(hakukohde.hakuajat));

  return hakuKohdeAuki ? 'hakukohde' : null;
};

const getWithoutVersion = (koodi: any) => koodi.slice(0, koodi.lastIndexOf('#'));

const getHakukohteetWithTypes = (toteutus: any) => {
  const hakutavat = _fp.flow(
    _fp.map(_fp.prop('hakutapa')),
    _fp.sortBy('koodiUri'),
    _fp.uniqBy('koodiUri')
  )(toteutus.hakutiedot);

  // Konfossa halutaan näyttää hakukohteet hakutyypeittäin, ei per haku
  return hakutavat.reduce(
    (a, hakutapa: any) => ({
      ...a,
      [getWithoutVersion(hakutapa.koodiUri)]: {
        nimi: hakutapa.nimi,
        hakukohteet: toteutus.hakutiedot
          .filter((hakutieto: any) => hakutieto.hakutapa.koodiUri === hakutapa.koodiUri)
          .flatMap((hakutieto: any) => hakutieto.hakukohteet)
          .filter((hakukohde: any) => isHakuTimeRelevant(hakukohde.hakuajat))
          .map((hakukohde: any) => ({
            ...hakukohde,
            isHakuAuki: isHakuAuki(hakukohde?.hakuajat),
          })),
      },
    }),
    {}
  );
};

export const selectMuuHaku = (toteutus: any) => {
  // TODO: SORA-kuvaus - atm. we only get an Id from the API but we cannot do anything with it
  return {
    ..._fp.pick(
      [
        'aloituspaikat',
        'hakuaika',
        'hakulomakeLinkki',
        'hakutermi',
        'lisatietoaHakeutumisesta',
        'lisatietoaValintaperusteista',
      ],
      toteutus.metadata
    ),
    isHakuAuki: Boolean(toteutus?.hakuAuki),
    nimi: toteutus.nimi,
    // TODO: we do not get osoite from the API atm. so just use all the tarjoajat to fetch oppilaitoksenOsat
    // This should be replaced with just the osoite when we have it in the API
    tarjoajat: toteutus.tarjoajat,
  };
};

export const selectHakukohteet = (toteutus: any) => {
  if (!toteutus || toteutus.hasMuuHaku || toteutus.hasEiSahkoistaHaku) {
    return {};
  }

  return getHakukohteetWithTypes(toteutus);
};

export const selectToteutus = (toteutus: any) => {
  return (
    toteutus && {
      ...toteutus,
      hasMuuHaku: toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.MUU,
      hasEiSahkoistaHaku:
        toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.EI_SAHKOISTA,
      hakuAukiType: getHakuAukiType(toteutus),
      eiSahkoistaHakuData: {
        ..._fp.pick(['lisatietoaHakeutumisesta'], toteutus.metadata),
      },
      hakukohteet: selectHakukohteet(toteutus),
      muuHakuData: selectMuuHaku(toteutus),
    }
  );
};

type UseToteutusProps = {
  oid: string;
  isDraft?: boolean;
};

export const useToteutus = ({ oid, isDraft }: UseToteutusProps) => {
  return useQuery<Toteutus>(
    ['getToteutus', { oid, isDraft }],
    () => getToteutus(oid, isDraft),
    {
      select: selectToteutus,
      enabled: Boolean(oid),
    }
  );
};

export const useDemoLinks = (hakukohteet: Array<Hakukohde>) => {
  const hakukohdeOids = hakukohteet.map((hakukohde) => hakukohde.hakukohdeOid);
  return useQuery<Map<string, undefined | Map<string, Translateable>>>(
    ['demoLinksPerLomakeId', { hakukohdeOids }],
    () => demoLinksPerLomakeId(hakukohteet),
    {
      enabled: Boolean(hakukohteet),
    }
  );
};
