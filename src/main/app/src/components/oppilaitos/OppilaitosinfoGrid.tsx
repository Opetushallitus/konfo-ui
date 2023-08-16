import { flow, map, join, toString, isEmpty, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { InfoGridIcon } from '#/src/components/common/InfoGridIcon';
import { getLanguage, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { condArray } from '#/src/tools/utils';
import { Koodi } from '#/src/types/common';

type Props = {
  opiskelijoita: number;
  kotipaikat: Array<Koodi>;
  opetuskieli: Array<Koodi>;
  tutkintoonJohtavat: number;
  tutkintoonJohtamattomat: number;
  toimipisteita?: number;
};

type Perustieto = {
  icon: JSX.Element;
  title: string;
  text: string;
};

export const OppilaitosinfoGrid = ({
  opiskelijoita,
  kotipaikat,
  opetuskieli,
  tutkintoonJohtavat,
  tutkintoonJohtamattomat,
  toimipisteita,
}: Props) => {
  const { t } = useTranslation();

  const paikkakunnat = localizeArrayToCommaSeparated(kotipaikat, { sorted: true });
  const opetuskielet = flow(
    (k) => map(k, `nimi.${getLanguage()}`),
    (nimet) => join(nimet, ', ')
  )(opetuskieli);

  const perustiedotData: Array<Perustieto> = [
    {
      icon: <InfoGridIcon icon="public" variant="outlined" />,
      title: t('oppilaitos.paikkakunta'),
      text: paikkakunnat,
    },
    {
      icon: <InfoGridIcon icon="people_outline" />,
      title: t('oppilaitos.opiskelojoita'),
      text: toString(opiskelijoita),
    },
    {
      icon: <InfoGridIcon icon="chat_bubble_outline" />,
      title: t('oppilaitos.opetuskielet'),
      text: opetuskielet,
    },
    ...condArray(toimipisteita != null, {
      icon: <InfoGridIcon icon="home_work" variant="outlined" />,
      title: t('oppilaitos.toimipisteita'),
      text: toString(toimipisteita),
    }),
    {
      icon: <InfoGridIcon icon="school" variant="outlined" />,
      title: t('oppilaitos.tutkintoon-johtavia-koulutuksia'),
      text: toString(tutkintoonJohtavat),
    },
    {
      icon: <InfoGridIcon icon="local_library" variant="outlined" />,
      title: t('oppilaitos.koulutuksia-jotka-eivat-johda-tutkntoon'),
      text: toString(tutkintoonJohtamattomat),
    },
  ];

  const filteredPerustiedotData = perustiedotData
    .filter((perustieto) => !isEmpty(perustieto.text))
    .filter((perustieto) => !isEqual(perustieto.text.trim(), '0'));

  return <InfoGrid gridData={filteredPerustiedotData} />;
};
