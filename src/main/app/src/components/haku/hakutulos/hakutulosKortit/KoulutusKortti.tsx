import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  EntiteettiKortti,
  EntiteettiKorttiTiivistetty,
} from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
import { ToteutustenTarjoajat, Translateable } from '#/src/types/common';

import { getToteutustenTarjoajat } from './getToteutustenTarjoajat';

export type Koulutus = {
  nimi?: Translateable;
  oid: string;
  kuvaus: Translateable;
  koulutustyyppi: Koulutustyyppi;
  tutkintonimikkeet: Array<Translateable>;
  teemakuva?: string;
  toteutustenTarjoajat: ToteutustenTarjoajat;
  isAvoinKorkeakoulutus: boolean;
};

type Props = {
  koulutus: Koulutus;
  isSmall?: boolean;
};

const formatTutkintonimikkeetText = (tutkintonimikkeet: Array<Translateable>) =>
  tutkintonimikkeet.map(localize).join(', ').replace(/,\s*$/, '');

export const KoulutusKortti = ({ koulutus, isSmall }: Props) => {
  const { t } = useTranslation();

  const {
    oid,
    tutkintonimikkeet,
    teemakuva,
    kuvaus,
    toteutustenTarjoajat,
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  } = koulutus;

  const toteutustenTarjoajatText = getToteutustenTarjoajat(t, toteutustenTarjoajat);

  const koulutustyyppiText = useVisibleKoulutustyyppi({
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  });

  const tutkintonimikkeetText = formatTutkintonimikkeetText(tutkintonimikkeet || []);

  return (
    <EntiteettiKortti
      koulutustyyppi={koulutustyyppi}
      to={`/koulutus/${oid}`}
      teemakuvaElement={<KoulutusKorttiLogo image={teemakuva} alt="" />}
      header={localize(koulutus)}
      kuvaus={localize(kuvaus)}
      iconTexts={[
        isEmpty(tutkintonimikkeetText)
          ? [koulutustyyppiText, createMaterialIcon('extension', 'outlined')]
          : [tutkintonimikkeetText, createMaterialIcon('school', 'outlined')],
        [
          getLocalizedKoulutusLaajuus(koulutus),
          createMaterialIcon('timelapse', 'outlined'),
        ],
        toteutustenTarjoajatText
          ? [toteutustenTarjoajatText, createMaterialIcon('home_work', 'outlined')]
          : undefined,
      ]}
      isSmall={isSmall}
    />
  );
};

export const KoulutusKorttiTiivistetty = ({ koulutus, isSmall }: Props) => {
  const { t } = useTranslation();

  const {
    oid,
    tutkintonimikkeet,
    toteutustenTarjoajat,
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  } = koulutus;

  const toteutustenTarjoajatText = getToteutustenTarjoajat(t, toteutustenTarjoajat);

  const koulutustyyppiText = useVisibleKoulutustyyppi({
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  });

  const tutkintonimikkeetText = formatTutkintonimikkeetText(tutkintonimikkeet || []);

  return (
    <EntiteettiKorttiTiivistetty
      koulutustyyppi={koulutustyyppi}
      to={`/koulutus/${oid}`}
      header={localize(koulutus)}
      iconTexts={[
        isEmpty(tutkintonimikkeetText)
          ? [koulutustyyppiText, createMaterialIcon('extension', 'outlined')]
          : [tutkintonimikkeetText, createMaterialIcon('school', 'outlined')],
        [
          getLocalizedKoulutusLaajuus(koulutus),
          createMaterialIcon('timelapse', 'outlined'),
        ],
        toteutustenTarjoajatText
          ? [toteutustenTarjoajatText, createMaterialIcon('home_work', 'outlined')]
          : undefined,
      ]}
      isSmall={isSmall}
    />
  );
};
