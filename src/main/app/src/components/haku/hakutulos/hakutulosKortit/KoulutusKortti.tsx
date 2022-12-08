import React from 'react';

import {
  SchoolOutlined,
  ExtensionOutlined,
  TimelapseOutlined,
  HomeWorkOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type ToteutustenTarjoajat = {
  count: number;
  nimi?: Translateable | null;
};

type Props = {
  koulutus: {
    oid: string;
    kuvaus: Translateable;
    koulutustyyppi: Koulutustyyppi;
    tutkintonimikkeet: Array<Translateable>;
    teemakuva?: string;
    toteutustenTarjoajat: ToteutustenTarjoajat;
    johtaaTutkintoon: boolean;
    isAvoinKorkeakoulutus: boolean;
  };
  isSmall?: boolean;
};

const useToteutustenTarjoajat = (toteutustenTarjoajat?: ToteutustenTarjoajat) => {
  const { t } = useTranslation();

  if (toteutustenTarjoajat) {
    switch (toteutustenTarjoajat?.count) {
      case 0:
        return t('haku.ei-koulutuksen-tarjoajia');
      case 1:
        return localize(toteutustenTarjoajat?.nimi);
      default:
        return `${toteutustenTarjoajat?.count} ${t('haku.koulutuksen-tarjoajaa')}`;
    }
  }
};

export const KoulutusKortti = ({ koulutus, isSmall }: Props) => {
  const { t } = useTranslation();

  const {
    oid,
    johtaaTutkintoon,
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

  const tutkintonimikkeetText =
    (tutkintonimikkeet || []).map(localize).join(', ').replace(/,\s*$/, '') ||
    t('haku.ei-tutkintonimiketta');

  return (
    <EntiteettiKortti
      koulutustyyppi={koulutustyyppi}
      to={`/koulutus/${oid}`}
      teemakuvaElement={<KoulutusKorttiLogo image={teemakuva} alt="" />}
      header={localize(koulutus)}
      kuvaus={kuvausText}
      iconTexts={[
        johtaaTutkintoon
          ? [tutkintonimikkeetText, SchoolOutlined]
          : [koulutustyyppiText, ExtensionOutlined],
        [getLocalizedKoulutusLaajuus(koulutus), TimelapseOutlined],
        toteutustenTarjoajatText && [toteutustenTarjoajatText, HomeWorkOutlined],
      ]}
      isSmall={isSmall}
    />
  );
};
