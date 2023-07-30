import React from 'react';

import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
import { ToteutustenTarjoajat, Translateable } from '#/src/types/common';

import { getToteutustenTarjoajat } from './getToteutustenTarjoajat';

type Props = {
  koulutus: {
    oid: string;
    kuvaus: Translateable;
    koulutustyyppi: Koulutustyyppi;
    tutkintonimikkeet: Array<Translateable>;
    teemakuva?: string;
    toteutustenTarjoajat: ToteutustenTarjoajat;
    isAvoinKorkeakoulutus: boolean;
  };
  isSmall?: boolean;
};

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

  const kuvausText =
    localize(kuvaus)
      .replace(/<\/li>/gm, ',</li>')
      .replace(/\.,<\/li>/gm, '.</li>')
      .replace(/<[^>]*>/gm, '') || t('haku.ei_kuvausta');

  const toteutustenTarjoajatText = getToteutustenTarjoajat(t, toteutustenTarjoajat);

  const koulutustyyppiText = useVisibleKoulutustyyppi({
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  });

  const tutkintonimikkeetText = (tutkintonimikkeet || [])
    .map(localize)
    .join(', ')
    .replace(/,\s*$/, '');

  return (
    <EntiteettiKortti
      koulutustyyppi={koulutustyyppi}
      to={`/koulutus/${oid}`}
      teemakuvaElement={<KoulutusKorttiLogo image={teemakuva} alt="" />}
      header={localize(koulutus)}
      kuvaus={kuvausText}
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
