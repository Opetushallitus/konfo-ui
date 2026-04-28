import { TFunction } from 'i18next';
import { isEmpty, some } from 'lodash';

import { getHakuDemo } from '#/src/api/konfoApi';
import {
  Alkamiskausityyppi,
  KOULUTUS_TYYPPI,
  MAKSULLISUUSTYYPPI,
  Koulutustyyppi,
} from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { Alkamiskausi, KoutaKoulutustyyppi, Translateable } from '#/src/types/common';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Maksu } from '#/src/types/ToteutusTypes';

export const formatAloitus = (
  {
    alkamiskausityyppi,
    henkilokohtaisenSuunnitelmanLisatiedot,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    formatoituKoulutuksenalkamispaivamaara,
    formatoituKoulutuksenpaattymispaivamaara,
  }: Alkamiskausi = {} as Alkamiskausi,
  t: TFunction
) => {
  switch (alkamiskausityyppi) {
    case Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA:
      return {
        alkaaText: t('toteutus.koulutus-alkaa-henkilokohtainen'),
        alkaaModalText: henkilokohtaisenSuunnitelmanLisatiedot,
      };
    case Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA:
      return {
        alkaaText: localize(formatoituKoulutuksenalkamispaivamaara),
        paattyyText: localize(formatoituKoulutuksenpaattymispaivamaara),
      };
    case Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI:
      return {
        alkaaText: [localize(koulutuksenAlkamiskausi), koulutuksenAlkamisvuosi].join(' '),
      };
    default:
      return {};
  }
};

const formDemoLink = (link: Translateable): Translateable => {
  const transform = (langLink: string | undefined) => {
    if (langLink && !isEmpty(langLink)) {
      return langLink.includes('?')
        ? langLink.concat('&demo=true')
        : langLink.concat('?demo=true');
    }
    return langLink;
  };
  return {
    fi: transform(link.fi),
    en: transform(link.en),
    sv: transform(link.sv),
  };
};

export const demoLinksPerLomakeId = async (
  hakukohteet: Array<Hakukohde>
): Promise<Map<string, undefined | Map<string, Translateable>>> => {
  const closedHakukohteet = hakukohteet.filter((hakukohde) => !hakukohde.isHakuAuki);
  const result: Map<string, undefined | Map<string, Translateable>> = new Map();

  for (const hakukohde of closedHakukohteet) {
    const lomakeId = hakukohde.hakulomakeAtaruId;
    const hakukohdeOid = hakukohde.hakukohdeOid;
    const hakuOid = hakukohde.hakuOid;
    if (!result.has(lomakeId)) {
      const hakukohdeDemo = await getHakuDemo(hakuOid);
      if (hakukohdeDemo.demoAllowed) {
        const linkMap: Map<string, Translateable> = new Map();
        linkMap.set(hakukohdeOid, formDemoLink(hakukohde.hakulomakeLinkki));
        result.set(lomakeId, linkMap);
      } else {
        result.set(lomakeId, undefined);
      }
    } else if (result.get(lomakeId)) {
      result.get(lomakeId)?.set(hakukohdeOid, formDemoLink(hakukohde.hakulomakeLinkki));
    }
  }

  return result;
};

export const isLukuvuosimaksullinen = (maksut?: Array<Maksu>) => {
  return some(
    maksut,
    (mt) => mt?.maksullisuustyyppi === MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU
  );
};

export const isLukuvuosimaksullinenKkToteutus = (
  maksut?: Array<Maksu>,
  koulutustyyppi?: KoutaKoulutustyyppi
) => {
  return (
    isLukuvuosimaksullinen(maksut) &&
    [KOULUTUS_TYYPPI.AMKKOULUTUS, KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS].includes(
      koulutustyyppi as Koulutustyyppi
    )
  );
};

export const formatMaksullisuusTitle = (
  t: TFunction,
  maksut?: Array<Maksu>,
  koulutustyyppi?: KoutaKoulutustyyppi
) => {
  return isLukuvuosimaksullinenKkToteutus(maksut, koulutustyyppi)
    ? t('toteutus.lukuvuosimaksu-kk')
    : isLukuvuosimaksullinen(maksut) && maksut?.length === 1
      ? t('toteutus.lukuvuosimaksu')
      : t('toteutus.maksullisuus');
};
