import {
  SchoolOutlined,
  PublicOutlined,
  LocalLibraryOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

type Props = {
  oppilaitos: {
    koulutusohjelmatLkm?: {
      kaikki: number;
      tutkintoonJohtavat: number;
      eiTutkintoonJohtavat: number;
    };
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

  const tutkintoonJohtavat = oppilaitos?.koulutusohjelmatLkm?.tutkintoonJohtavat;
  const tutkintoonJohtamattomat = oppilaitos?.koulutusohjelmatLkm?.eiTutkintoonJohtavat;
  const tutkintoonJohtavatStr = tutkintoonJohtavat
    ? t('haku.tutkintoon-johtava-koulutus-maara', {
        count: tutkintoonJohtavat,
      })
    : t('haku.ei-tutkintoon-johtavia-koulutuksia');
  const tutkintoonJohtamattomatStr = tutkintoonJohtamattomat
    ? t('haku.tutkintoon-johtamaton-koulutus-maara', {
        count: tutkintoonJohtamattomat,
      })
    : t('haku.ei-tutkintoon-johtamattomia-koulutuksia');
  const logoAltText = `${localize(oppilaitos)} ${t('haku.oppilaitoksen-logo')}`;
  const iconTexts = [
    [tutkintoonJohtavatStr, SchoolOutlined],
    [tutkintoonJohtamattomatStr, LocalLibraryOutlined],
    [paikkakunnatStr, PublicOutlined],
  ]
    .filter((it) => it[0] !== t('haku.ei-tutkintoon-johtavia-koulutuksia'))
    .filter((it) => it[0] !== t('haku.ei-tutkintoon-johtamattomia-koulutuksia'));

  return (
    <EntiteettiKortti
      to={`/oppilaitos/${oppilaitos?.oid}`}
      logoElement={<OppilaitosKorttiLogo image={oppilaitos?.logo} alt={logoAltText} />}
      header={localize(oppilaitos)}
      kuvaus={kuvaus}
      iconTexts={iconTexts}
      isSmall={isSmall}
    />
  );
};
