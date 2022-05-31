import React from 'react';

import {
  SchoolOutlined,
  ExtensionOutlined,
  TimelapseOutlined,
  HomeWorkOutlined,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { Koulutustyyppi } from '#/src/constants';
import { hasTutkintonimike } from '#/src/tools/hasTutkintonimike';
import { localize } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type ToteutustenTarjoajat = {
  count: number;
  nimi?: Translateable | null;
};

type Props = {
  koulutus: {
    oid: string;
    kuvaus: Translateable;
    koulutustyyppi: string;
    tutkintonimikkeet: Array<Translateable>;
    teemakuva?: string;
    toteutustenTarjoajat: ToteutustenTarjoajat;
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

  const kuvaus =
    localize(koulutus?.kuvaus)
      .replace(/<\/li>/gm, ',</li>')
      .replace(/\.,<\/li>/gm, '.</li>')
      .replace(/<[^>]*>/gm, '') || t('haku.ei_kuvausta');
  const koulutusHasTutkintonimike = hasTutkintonimike(
    koulutus?.koulutustyyppi as Koulutustyyppi
  );

  const tutkintoNimikkeet = koulutusHasTutkintonimike
    ? (koulutus?.tutkintonimikkeet || []).map(localize).join(', ').replace(/,\s*$/, '') ||
      t('haku.ei-tutkintonimiketta')
    : t(`haku.${koulutus?.koulutustyyppi}`);
  const teemakuvaAltText = `${localize(koulutus)} ${t('koulutus.koulutuksen-teemakuva')}`;

  const toteutustenTarjoajatText = useToteutustenTarjoajat(
    koulutus?.toteutustenTarjoajat
  );

  return (
    <EntiteettiKortti
      koulutustyyppi={koulutus?.koulutustyyppi}
      to={`/koulutus/${koulutus?.oid}`}
      teemakuvaElement={
        <KoulutusKorttiLogo image={koulutus?.teemakuva} alt={teemakuvaAltText} />
      }
      header={localize(koulutus)}
      kuvaus={kuvaus}
      iconTexts={[
        [
          tutkintoNimikkeet,
          koulutusHasTutkintonimike ? SchoolOutlined : ExtensionOutlined,
        ],
        [getLocalizedOpintojenLaajuus(koulutus), TimelapseOutlined],
        toteutustenTarjoajatText && [toteutustenTarjoajatText, HomeWorkOutlined],
      ]}
      isSmall={isSmall}
    />
  );
};
