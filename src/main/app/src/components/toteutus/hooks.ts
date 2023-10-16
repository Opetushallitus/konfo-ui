import { flow, map, sortBy, uniqBy, pick } from 'lodash';
import { useQuery } from 'react-query';

import { getToteutus } from '#/src/api/konfoApi';
import { Hakulomaketyyppi } from '#/src/constants';
import { isHakuAuki, isHakuMennyt } from '#/src/tools/hakuaikaUtils';
import { Translateable } from '#/src/types/common';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { demoLinksPerLomakeId } from './utils';

const getWithoutVersion = (koodi: any) => koodi.slice(0, koodi.lastIndexOf('#'));

export const selectToteutusHakulomaketyyppi = (toteutus?: Toteutus) =>
  toteutus?.metadata?.hakulomaketyyppi;

const selectHakukohteetByHakutapa = (toteutus: any) => {
  const hakulomaketyyppi = selectToteutusHakulomaketyyppi(toteutus);
  if (
    !toteutus ||
    [Hakulomaketyyppi.MUU, Hakulomaketyyppi.EI_SAHKOISTA].includes(hakulomaketyyppi!)
  ) {
    return {};
  }

  const hakutavat = flow(
    (tiedot) => map(tiedot, 'hakutapa'),
    (tavat) => sortBy(tavat, 'koodiUri'),
    (koodit) => uniqBy(koodit, 'koodiUri')
  )(toteutus.hakutiedot);

  // Konfossa halutaan näyttää hakukohteet hakutyypeittäin, ei per haku
  return hakutavat.reduce(
    (a, hakutapa: any) => ({
      ...a,
      [getWithoutVersion(hakutapa.koodiUri)]: {
        nimi: hakutapa.nimi,
        hakukohteet: toteutus.hakutiedot
          .filter((hakutieto: any) => hakutieto.hakutapa.koodiUri === hakutapa.koodiUri)
          .flatMap((hakutieto: any) =>
            hakutieto.hakukohteet.map((hakukohde: any) => ({
              ...hakukohde,
              hakuOid: hakutieto.hakuOid,
              kohdejoukko: hakutieto.kohdejoukko,
              isHakuMennyt: isHakuMennyt(hakukohde?.hakuajat),
              isHakuAuki: isHakuAuki(hakukohde?.hakuajat),
            }))
          ),
      },
    }),
    {}
  );
};

export const selectMuuHaku = (toteutus: any) => {
  // TODO: SORA-kuvaus - atm. we only get an Id from the API but we cannot do anything with it
  return {
    ...pick(toteutus.metadata, [
      'aloituspaikat',
      'hakuaika',
      'hakulomakeLinkki',
      'hakutermi',
      'lisatietoaHakeutumisesta',
      'lisatietoaValintaperusteista',
      'opetus',
    ]),
    isHakuAuki: Boolean(toteutus?.hakuAuki),
    nimi: toteutus.nimi,
    // TODO: we do not get osoite from the API atm. so just use all the tarjoajat to fetch oppilaitoksenOsat
    // This should be replaced with just the osoite when we have it in the API
    tarjoajat: toteutus.tarjoajat,
  };
};

export const selectToteutus = (toteutus: any) => {
  return (
    toteutus && {
      ...toteutus,
      hakukohteetByHakutapa: selectHakukohteetByHakutapa(toteutus),
    }
  );
};

type UseToteutusProps = {
  oid?: string;
  isDraft?: boolean;
};

export const useToteutus = ({ oid, isDraft }: UseToteutusProps) => {
  return useQuery<Toteutus>(
    ['getToteutus', { oid, isDraft }],
    () => getToteutus(oid!, isDraft),
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
