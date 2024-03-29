import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { createMaterialIcon } from '#/src/components/common/MaterialIcon';
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

  const tutkintoonJohtavat = oppilaitos?.koulutusohjelmatLkm?.tutkintoonJohtavat;
  const tutkintoonJohtamattomat = oppilaitos?.koulutusohjelmatLkm?.eiTutkintoonJohtavat;

  const logoAltText = `${localize(oppilaitos)} ${t('haku.oppilaitoksen-logo')}`;

  return (
    <EntiteettiKortti
      to={`/oppilaitos/${oppilaitos?.oid}`}
      logoElement={<OppilaitosKorttiLogo image={oppilaitos?.logo} alt={logoAltText} />}
      header={localize(oppilaitos)}
      kuvaus={localize(oppilaitos?.kuvaus)}
      iconTexts={[
        tutkintoonJohtavat
          ? [
              t('haku.tutkintoon-johtava-koulutus-maara', {
                count: tutkintoonJohtavat,
              }),
              createMaterialIcon('school', 'outlined'),
            ]
          : undefined,
        tutkintoonJohtamattomat
          ? [
              t('haku.tutkintoon-johtamaton-koulutus-maara', {
                count: tutkintoonJohtamattomat,
              }),
              createMaterialIcon('local_library', 'outlined'),
            ]
          : undefined,
        [paikkakunnatStr, createMaterialIcon('public', 'outlined')],
      ]}
      isSmall={isSmall}
    />
  );
};
