import React from 'react';

import { Class, ExtensionOutlined, LabelOutlined } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EuroIcon from '@mui/icons-material/Euro';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { styled } from '@mui/material/styles';
import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Koulutustyyppi, NDASH, MAKSULLISUUSTYYPPI } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';
import { Opetus, Yksikko } from '#/src/types/ToteutusTypes';

import { formatAloitus } from './utils';

const PREFIX = 'ToteutusInfoGrid';

const classes = {
  koulutusInfoGridIcon: `${PREFIX}-koulutusInfoGridIcon`,
};

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  [`& .${classes.koulutusInfoGridIcon}`]: {
    color: theme.palette.primary.main,
  },
}));

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
  koulutustyyppi?: Koulutustyyppi;
  isAvoinKorkeakoulutus?: boolean;
  tunniste?: string;
  opinnonTyyppi?: Koodi;
  taiteenala?: Array<Translateable>;
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
      icon: <ExtensionOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutustyyppi'),
      text: koulutustyyppiText,
      testid: 'koulutustyyppi',
    },
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalText: !isEmpty(opetus.opetuskieletKuvaus) && (
        <LocalizedHTML data={opetus.opetuskieletKuvaus!} noMargin />
      ),
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuus,
    }
  );

  const taiteenalaString = taiteenala?.map(localizeMap).join('\n') ?? '';

  if (!isEmpty(taiteenalaString)) {
    perustiedotData.push({
      icon: <ColorLensIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.taiteenala'),
      text: taiteenalaString,
    });
  }

  perustiedotData.push({
    icon: <ScheduleIcon className={classes.koulutusInfoGridIcon} />,
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
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.koulutus-alkaa'),
      text: alkaaText,
      modalText: !isEmpty(alkaaModalText) && (
        <LocalizedHTML data={alkaaModalText} noMargin />
      ),
    });
  }

  if (paattyyText) {
    perustiedotData.push({
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.koulutus-paattyy'),
      text: paattyyText,
    });
  }

  perustiedotData.push(
    {
      icon: <HourglassEmptyOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetusaika'),
      text: opetusAikaString,
      modalText: !isEmpty(opetus.opetusaikaKuvaus) && (
        <LocalizedHTML data={opetus.opetusaikaKuvaus!} noMargin />
      ),
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalText: !isEmpty(opetus.opetustapaKuvaus) && (
        <LocalizedHTML data={opetus.opetustapaKuvaus!} noMargin />
      ),
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
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
      icon: <Class className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.opinnonTyyppi'),
      text: opinnonTyyppiText,
    });
  }

  if (!isEmpty(tunniste)) {
    perustiedotData.push({
      icon: <LabelOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tunniste'),
      text: tunniste,
    });
  }

  return (
    <Root>
      <InfoGrid gridData={perustiedotData} />
    </Root>
  );
};
