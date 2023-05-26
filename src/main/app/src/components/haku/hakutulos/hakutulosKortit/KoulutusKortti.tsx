import React from 'react';

import {
  SchoolOutlined,
  ExtensionOutlined,
  TimelapseOutlined,
  HomeWorkOutlined,
} from '@mui/icons-material';
import { isEmpty } from 'lodash';
import { TFunction, useTranslation } from 'react-i18next';
import { match, P } from 'ts-pattern';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
import { ToteutustenTarjoajat, Translateable } from '#/src/types/common';

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

const useToteutustenTarjoajat = (toteutustenTarjoajat?: ToteutustenTarjoajat) => {
  const { t } = useTranslation();
  return getToteutustenTarjoajat(t, toteutustenTarjoajat);
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

  const toteutustenTarjoajatText = useToteutustenTarjoajat(toteutustenTarjoajat);

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
          ? [koulutustyyppiText, ExtensionOutlined]
          : [tutkintonimikkeetText, SchoolOutlined],
        [getLocalizedKoulutusLaajuus(koulutus), TimelapseOutlined],
        toteutustenTarjoajatText
          ? [toteutustenTarjoajatText, HomeWorkOutlined]
          : undefined,
      ]}
      isSmall={isSmall}
    />
  );
};
