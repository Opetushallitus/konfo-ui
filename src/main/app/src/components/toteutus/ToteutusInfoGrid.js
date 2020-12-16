import React from 'react';
import InfoGrid from '../common/InfoGrid';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import EuroIcon from '@material-ui/icons/Euro';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Localizer as l } from '#/src/tools/Utils';
import { format } from 'date-fns';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import _ from 'lodash';
import { sanitizedHTMLParser } from '#/src/tools/Utils';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const suunniteltuKesto = (t, vuosi, kk) => {
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

const localizeMap = (v) => l.localize(v);
const hasNimike = (tyyppi) =>
  tyyppi !== KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA &&
  tyyppi !== KOULUTUS_TYYPPI.AMM_OSAAMISALA;

export const ToteutusInfoGrid = (props) => {
  const classes = useStyles();
  const {
    koulutusTyyppi,
    nimikkeet,
    kielet,
    opetuskieletKuvaus,
    laajuus,
    aloitus,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet,
    suunniteltuKestoKuvaus,
    opetusaika,
    opetusaikaKuvaus,
    opetustapa,
    opetustapaKuvaus,
    maksullisuus,
    maksullisuusKuvaus,
    apuraha,
    apurahaKuvaus,
  } = props;
  const { t } = useTranslation();

  const kieliString = kielet?.map(localizeMap).join('\n') ?? '';
  const laajuusString = !laajuus.includes(undefined)
    ? laajuus.map(localizeMap).join(' ')
    : t('koulutus.ei-laajuutta');
  const kestoString = suunniteltuKesto(
    t,
    suunniteltuKestoVuodet,
    suunniteltuKestoKuukaudet
  );

  const aloitusString = aloitus[0]
    ? format(new Date(aloitus[1]), 'd.M.y')
    : `${l.localize(aloitus[2])} ${aloitus[3]}`;
  const opetusAikaString = opetusaika?.map(localizeMap).join('\n') ?? '';
  const opetustapaString = opetustapa?.map(localizeMap).join('\n') ?? '';
  const maksullisuusString = maksullisuus ? `${maksullisuus} €` : t('toteutus.ei-maksua');
  const apurahaString = apuraha ? `${apuraha} €` : t('toteutus.ei-apurahaa');

  const perustiedotData = [];

  if (hasNimike(koulutusTyyppi)) {
    const currentLanguage = l.getLanguage();
    const nimikeString = nimikkeet
      ? nimikkeet
          .filter((elem) => elem.kieli === currentLanguage)
          .map((elem) => elem.arvo)
          .join('\n')
      : t('koulutus.ei-tutkintonimiketta');

    perustiedotData.push({
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.tutkintonimikkeet'),
      text: nimikeString,
    });
  }

  perustiedotData.push(
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetuskieli'),
      text: kieliString,
      modalData: {
        icon: <InfoOutlined />,
        text:
          !_.isEmpty(opetuskieletKuvaus) &&
          sanitizedHTMLParser(l.localize(opetuskieletKuvaus)),
      },
    },
    {
      icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuusString,
    },
    {
      icon: <ScheduleIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.suunniteltu-kesto'),
      text: kestoString,
      modalData: {
        icon: <InfoOutlined />,
        text:
          !_.isEmpty(suunniteltuKestoKuvaus) &&
          sanitizedHTMLParser(l.localize(suunniteltuKestoKuvaus)),
      },
    },
    {
      icon: <FlagOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.alkaa'),
      text: aloitusString,
    },
    {
      icon: <HourglassEmptyOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetusaika'),
      text: opetusAikaString,
      modalData: {
        icon: <InfoOutlined />,
        text:
          !_.isEmpty(opetusaikaKuvaus) &&
          sanitizedHTMLParser(l.localize(opetusaikaKuvaus)),
      },
    },
    {
      icon: <MenuBookIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.opetustapa'),
      text: opetustapaString,
      modalData: {
        icon: <InfoOutlined />,
        text:
          !_.isEmpty(opetustapaKuvaus) &&
          sanitizedHTMLParser(l.localize(opetustapaKuvaus)),
      },
    },
    {
      icon: <EuroIcon className={classes.koulutusInfoGridIcon} />,
      title: t('toteutus.maksullisuus'),
      text: maksullisuusString,
      modalData: {
        icon: <InfoOutlined />,
        text:
          !_.isEmpty(maksullisuusKuvaus) &&
          sanitizedHTMLParser(l.localize(maksullisuusKuvaus)),
      },
    },
    {
      icon: 'ApurahaIcon',
      title: t('toteutus.apuraha'),
      text: apurahaString,
      modalData: {
        icon: <InfoOutlined />,
        text: !_.isEmpty(apurahaKuvaus) && sanitizedHTMLParser(l.localize(apurahaKuvaus)),
      },
    }
  );

  return <InfoGrid heading={t('koulutus.tiedot')} gridData={perustiedotData} />;
};
