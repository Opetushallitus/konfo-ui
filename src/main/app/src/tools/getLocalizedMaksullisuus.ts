import { isEmpty, some } from 'lodash';

import { KOULUTUS_TYYPPI, Koulutustyyppi, MAKSULLISUUSTYYPPI } from '#/src/constants';
import { Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import { getTranslationForKey } from './localization';

export const getLocalizedMaksullisuus = (
  koulutustyyppi?: Koulutustyyppi,
  maksullisuustyypit?: Array<Maksullisuustyyppi>,
  maksuAmount?: number,
  lukuvuosimaksuAmount?: number
) => {
  const isMaksuton = some(
    maksullisuustyypit,
    (maksullisuustyyppi: Maksullisuustyyppi): boolean =>
      maksullisuustyyppi === MAKSULLISUUSTYYPPI.MAKSUTON
  );
  const isMaksullinen = some(
    maksullisuustyypit,
    (maksullisuustyyppi: Maksullisuustyyppi): boolean =>
      maksullisuustyyppi === MAKSULLISUUSTYYPPI.MAKSULLINEN
  );
  const isLukuvuosimaksullinen = some(
    maksullisuustyypit,
    (maksullisuustyyppi: Maksullisuustyyppi): boolean =>
      maksullisuustyyppi === MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU
  );

  if (isEmpty(maksullisuustyypit)) {
    return getTranslationForKey('toteutus.maksuton');
  } else {
    if (isMaksuton) {
      return getTranslationForKey('toteutus.maksuton');
    }

    if (isLukuvuosimaksullinen && isMaksullinen && maksuAmount && lukuvuosimaksuAmount) {
      const maksullinenStr = `${getTranslationForKey('toteutus.maksullinen-opetus')}: ${maksuAmount} €`;
      const lukuvuosimaksuStr = `${getTranslationForKey('toteutus.lukuvuosimaksu')}: ${lukuvuosimaksuAmount} €`;
      return `${maksullinenStr}\n${lukuvuosimaksuStr}`;
    } else if (
      koulutustyyppi &&
      [KOULUTUS_TYYPPI.AMKKOULUTUS, KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS].includes(
        koulutustyyppi
      ) &&
      isLukuvuosimaksullinen &&
      lukuvuosimaksuAmount
    ) {
      return `${getTranslationForKey('toteutus.lukuvuosimaksu-kk')}: ${lukuvuosimaksuAmount}`;
    } else if (isMaksullinen && maksuAmount) {
      return maksuAmount;
    } else if (isLukuvuosimaksullinen && lukuvuosimaksuAmount) {
      return lukuvuosimaksuAmount;
    } else {
      return '';
    }
  }
};
