import React from 'react';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EuroIcon from '@material-ui/icons/Euro';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { makeStyles } from '@material-ui/styles';
import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';
import { Opetus, Yksikko } from '#/src/types/ToteutusTypes';

import { formatAloitus } from './utils';
import { NDASH } from '#/src/constants';

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
    ['maksullinen', 'lukuvuosimaksu'].includes(opetus?.maksullisuustyyppi)
    ? `${opetus?.maksunMaara} €`
    : t('toteutus.ei-maksua');
};

const useStyles = makeStyles((theme: any) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

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
};

export const ToteutusInfoGrid = ({ laajuus, opetus = {}, hasHaku }: Props) => {
  const classes = useStyles();
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

  perustiedotData.push(
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalText: !_.isEmpty(opetus.opetuskieletKuvaus) && (
        <LocalizedHTML data={opetus.opetuskieletKuvaus!} noMargin />
      ),
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuus,
    },
    {
      icon: <ScheduleIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.suunniteltu-kesto'),
      text: kestoString,
      modalText: !_.isEmpty(opetus.suunniteltuKestoKuvaus) && (
        <LocalizedHTML data={opetus.suunniteltuKestoKuvaus!} noMargin />
      ),
    }
  );

  const { alkaaText, alkaaModalText, paattyyText } = hasHaku
    ? ({} as any)
    : formatAloitus(opetus.koulutuksenAlkamiskausi, t);

  if (alkaaText) {
    perustiedotData.push({
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.koulutus-alkaa'),
      text: alkaaText,
      modalText: !_.isEmpty(alkaaModalText) && (
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
      modalText: !_.isEmpty(opetus.opetusaikaKuvaus) && (
        <LocalizedHTML data={opetus.opetusaikaKuvaus!} noMargin />
      ),
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalText: !_.isEmpty(opetus.opetustapaKuvaus) && (
        <LocalizedHTML data={opetus.opetustapaKuvaus!} noMargin />
      ),
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
      title:
        opetus?.maksullisuustyyppi === 'lukuvuosimaksu'
          ? t('toteutus.lukuvuosimaksu')
          : t('toteutus.maksullisuus'),
      text: maksullisuusString,
      modalText: !_.isEmpty(opetus.maksullisuusKuvaus) && (
        <LocalizedHTML data={opetus.maksullisuusKuvaus!} noMargin />
      ),
    },
    {
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
      modalText: !_.isEmpty(opetus?.apuraha?.kuvaus) && (
        <LocalizedHTML data={opetus.apuraha?.kuvaus!} noMargin />
      ),
    }
  );

  return <InfoGrid gridData={perustiedotData} />;
};
