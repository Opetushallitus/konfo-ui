import React from 'react';

import { SchoolOutlined, PublicOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

type Props = {
  oppilaitos: {
    koulutusohjelmia: number;
    kuvaus?: Translateable;
    logo?: string;
    oid: string;
    nimi: Translateable;
    paikkakunnat: Array<Koodi>;
  };
  isSmall: boolean;
};

export const OppilaitosKortti = ({ oppilaitos, isSmall }: Props) => {
  const { t } = useTranslation();

  const paikkakunnatStr = localizeArrayToCommaSeparated(oppilaitos?.paikkakunnat);

  const kuvaus =
    localize(oppilaitos?.kuvaus).replace(/<[^>]*>/gm, '') || t('haku.ei_kuvausta');

  const koulutusohjelmaCount = oppilaitos?.koulutusohjelmia || 0;

  const koulutusOhjelmatStr =
    koulutusohjelmaCount === 0
      ? t('haku.ei-tutkintoon-johtavia-koulutuksia')
      : t('haku.tutkintoon-johtava-koulutus-maara', {
          count: koulutusohjelmaCount,
        });
  const logoAltText = `${localize(oppilaitos)} ${t('haku.oppilaitoksen-logo')}`;

  return (
    <EntiteettiKortti
      to={`/oppilaitos/${oppilaitos?.oid}`}
      logoElement={<OppilaitosKorttiLogo image={oppilaitos?.logo} alt={logoAltText} />}
      header={localize(oppilaitos)}
      kuvaus={kuvaus}
      iconTexts={[
        [koulutusOhjelmatStr, SchoolOutlined],
        [paikkakunnatStr, PublicOutlined],
      ]}
      isSmall={isSmall}
    />
  );
};
