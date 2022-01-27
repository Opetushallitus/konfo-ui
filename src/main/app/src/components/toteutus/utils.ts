import { TFunction } from 'i18next';
import _ from 'lodash';

import { getHakukohdeDemo } from '#/src/api/konfoApi';
import { Alkamiskausityyppi } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { formatDateString } from '#/src/tools/utils';
import { Alkamiskausi, Translateable } from '#/src/types/common';
import { DemoLink, Hakukohde } from '#/src/types/HakukohdeTypes';

export const formatAloitus = (
  {
    alkamiskausityyppi,
    henkilokohtaisenSuunnitelmanLisatiedot,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    formatoituKoulutuksenalkamispaivamaara,
    koulutuksenPaattymispaivamaara,
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
        alkaaText: formatDateString(formatoituKoulutuksenalkamispaivamaara),
        paattyyText: koulutuksenPaattymispaivamaara
          ? formatDateString(new Date(koulutuksenPaattymispaivamaara))
          : null,
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
    if (!!langLink && !_.isEmpty(langLink)) {
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
): Promise<Map<string, undefined | DemoLink>> => {
  const closedHakukohteet = hakukohteet.filter((hakukohde) => !hakukohde.isHakuAuki);
  const result: Map<string, undefined | DemoLink> = new Map();

  for (const hakukohde of closedHakukohteet) {
    const lomakeId = hakukohde.hakulomakeAtaruId;
    if (!result.has(lomakeId)) {
      const hakukohdeOid = hakukohde.hakukohdeOid;
      const hakukohdeDemo = await getHakukohdeDemo(hakukohdeOid);
      if (hakukohdeDemo.demoAllowed) {
        const demoLink = {
          link: formDemoLink(hakukohde.hakulomakeLinkki),
          hakukohdeOid: hakukohdeOid,
        };
        result.set(lomakeId, demoLink);
      } else {
        result.set(lomakeId, undefined);
      }
    }
  }

  return result;
};
