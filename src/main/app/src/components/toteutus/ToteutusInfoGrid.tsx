import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { InfoGridIcon } from '#/src/components/common/InfoGridIcon';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { NDASH, MAKSULLISUUSTYYPPI, KOULUTUS_TYYPPI } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import {
  Koodi,
  KoutaKoulutustyyppi,
  Osaamismerkki,
  Translateable,
} from '#/src/types/common';
import { Opetus, Yksikko } from '#/src/types/ToteutusTypes';

import { formatAloitus } from './utils';

const getYksikkoSymbol = (yksikko?: Yksikko) => {
  switch (yksikko) {
    case Yksikko.EURO:
      return '€';
    case Yksikko.PROSENTTI:
      return '%';
    default:
      return '';
  }
};

const formatApuraha = (opetus: Opetus, t: TFunction) => {
  const yksikko = getYksikkoSymbol(opetus?.apuraha?.yksikko);
  if (opetus?.onkoApuraha) {
    if (opetus?.apuraha?.min === opetus?.apuraha?.max) {
      return `${opetus?.apuraha?.min} ${yksikko}`;
    } else {
      return `${opetus?.apuraha?.min} ${NDASH} ${opetus?.apuraha?.max} ${yksikko}`;
    }
  }

  return t('toteutus.ei-apurahaa');
};

const formatMaksullisuus = (opetus: Opetus, t: TFunction) => {
  return opetus?.maksunMaara &&
    opetus?.maksullisuustyyppi &&
    [MAKSULLISUUSTYYPPI.MAKSULLINEN, MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU].includes(
      opetus?.maksullisuustyyppi
    )
    ? `${opetus?.maksunMaara} €`
    : t('toteutus.ei-maksua');
};

const suunniteltuKesto = (t: TFunction, vuosi?: number, kk?: number) => {
  if (!vuosi && !kk) {
    return t('koulutus.ei-kestoa');
  }

  return [
    vuosi && t('koulutus.kesto-vuosi', { count: vuosi }),
    kk && t('koulutus.kesto-kuukausi', { count: kk }),
  ]
    .filter(Boolean)
    .join('\n');
};

const localizeMap = (v: Translateable) => localize(v);

type Props = {
  laajuus: string;
  opetus: Opetus;
  hasHaku: boolean;
  koulutustyyppi?: KoutaKoulutustyyppi;
  isAvoinKorkeakoulutus?: boolean;
  tunniste?: string;
  opinnonTyyppi?: Koodi;
  taiteenala?: Array<Translateable>;
  osaamismerkki?: Osaamismerkki;
  suoritetaanNayttona?: boolean;
};

export const ToteutusInfoGrid = ({
  laajuus,
  koulutustyyppi,
  isAvoinKorkeakoulutus = false,
  tunniste,
  opinnonTyyppi,
  taiteenala,
  opetus = {},
  hasHaku,
  osaamismerkki,
  suoritetaanNayttona = false,
}: Props) => {
  const { t } = useTranslation();

  const kieliString = opetus.opetuskieli?.map(localizeMap).join('\n') ?? '';
  const kestoString = suunniteltuKesto(
    t,
    opetus.suunniteltuKestoVuodet,
    opetus.suunniteltuKestoKuukaudet
  );

  const opetusAikaString = opetus.opetusaika?.map(localizeMap).join('\n') ?? '';
  const opetustapaString = opetus.opetustapa?.map(localizeMap).join('\n') ?? '';
  const maksullisuusString = formatMaksullisuus(opetus, t);
  const apurahaString = formatApuraha(opetus, t);

  const perustiedotData = [];

  const koulutustyyppiText = useVisibleKoulutustyyppi({
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  });

  perustiedotData.push(
    {
      icon: <InfoGridIcon icon="extension" variant="outlined" />,
      title: t('koulutus.koulutustyyppi'),
      text: koulutustyyppiText,
      testid: 'koulutustyyppi',
    },
    {
      icon: <InfoGridIcon icon="chat_bubble_outline" />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalText: !isEmpty(opetus.opetuskieletKuvaus) && (
        <LocalizedHTML data={opetus.opetuskieletKuvaus!} noMargin />
      ),
    }
  );

  const osaamismerkkiTeema = osaamismerkki?.kategoria?.nimi;
  if (!isEmpty(osaamismerkkiTeema)) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="category" variant="outlined" />,
      title: t('koulutus.teema'),
      text: localize(osaamismerkkiTeema),
    });
  }

  perustiedotData.push({
    icon: <InfoGridIcon icon="timelapse" />,
    title: t('koulutus.koulutuksen-laajuus'),
    text: laajuus,
  });

  const taiteenalaString = taiteenala?.map(localizeMap).join('\n') ?? '';

  if (!isEmpty(taiteenalaString)) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="color_lens" />,
      title: t('toteutus.taiteenala'),
      text: taiteenalaString,
    });
  }

  perustiedotData.push({
    icon: <InfoGridIcon icon="schedule" />,
    title: t('koulutus.suunniteltu-kesto'),
    text: kestoString,
    modalText: !isEmpty(opetus.suunniteltuKestoKuvaus) && (
      <LocalizedHTML data={opetus.suunniteltuKestoKuvaus!} noMargin />
    ),
  });

  const { alkaaText, alkaaModalText, paattyyText } = hasHaku
    ? ({} as any)
    : formatAloitus(opetus.koulutuksenAlkamiskausi, t);

  if (alkaaText) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="flag" variant="outlined" />,
      title: t('toteutus.koulutus-alkaa'),
      text: alkaaText,
      modalText: !isEmpty(alkaaModalText) && (
        <LocalizedHTML data={alkaaModalText} noMargin />
      ),
    });
  }

  if (paattyyText) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="flag" variant="outlined" />,
      title: t('toteutus.koulutus-paattyy'),
      text: paattyyText,
    });
  }

  perustiedotData.push(
    {
      icon: <InfoGridIcon icon="hourglass_empty" variant="outlined" />,
      title: t('toteutus.opetusaika'),
      text: opetusAikaString,
      modalText: !isEmpty(opetus.opetusaikaKuvaus) && (
        <LocalizedHTML data={opetus.opetusaikaKuvaus!} noMargin />
      ),
    },
    {
      icon: <InfoGridIcon icon="menu_book" />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalText: !isEmpty(opetus.opetustapaKuvaus) && (
        <LocalizedHTML data={opetus.opetustapaKuvaus!} noMargin />
      ),
    },
    {
      icon: <InfoGridIcon icon="euro_symbol" />,
      title:
        opetus?.maksullisuustyyppi === MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU
          ? t('toteutus.lukuvuosimaksu')
          : t('toteutus.maksullisuus'),
      text: maksullisuusString,
      modalText: !isEmpty(opetus.maksullisuusKuvaus) && (
        <LocalizedHTML data={opetus.maksullisuusKuvaus!} noMargin />
      ),
    }
  );

  if (opetus?.maksullisuustyyppi === MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU) {
    perustiedotData.push({
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
      modalText: !isEmpty(opetus?.apuraha?.kuvaus) && (
        <LocalizedHTML data={opetus.apuraha?.kuvaus} noMargin />
      ),
    });
  }

  const opinnonTyyppiText = localize(opinnonTyyppi);

  if (!isEmpty(opinnonTyyppiText)) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="class" />,
      title: t('koulutus.opinnonTyyppi'),
      text: opinnonTyyppiText,
    });
  }

  if (!isEmpty(tunniste)) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="label" variant="outlined" />,
      title: t('koulutus.tunniste'),
      text: tunniste,
    });
  }

  if (koulutustyyppi === KOULUTUS_TYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="app_registration" variant="outlined" />,
      title: t('koulutus.suoritustapa'),
      text: suoritetaanNayttona ? t('koulutus.naytto') : t('koulutus.opintojakso'),
    });
  }

  return <InfoGrid gridData={perustiedotData} />;
};
