import { TFunction } from 'i18next';

import { Alkamiskausityyppi } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { formatDateString } from '#/src/tools/utils';
import { Alkamiskausi } from '#/src/types/common';

export const formatAloitus = (
  {
    alkamiskausityyppi,
    henkilokohtaisenSuunnitelmanLisatiedot,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    koulutuksenAlkamispaivamaara,
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
        alkaaText: formatDateString(new Date(koulutuksenAlkamispaivamaara)),
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
