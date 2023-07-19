import { TFunction } from 'i18next';
import { match, P } from 'ts-pattern';

import { localize } from '#/src/tools/localization';
import { ToteutustenTarjoajat } from '#/src/types/common';

export const getToteutustenTarjoajat = (
  t: TFunction,
  toteutustenTarjoajat?: ToteutustenTarjoajat
) =>
  match(toteutustenTarjoajat)
    .with({ count: 0 }, () => t('haku.ei-koulutuksen-tarjoajia'))
    .with({ count: 1 }, () => localize(toteutustenTarjoajat?.nimi))
    .with(
      { count: P.number },
      () => `${toteutustenTarjoajat?.count} ${t('haku.koulutuksen-tarjoajaa')}`
    )
    .otherwise(() => undefined);
