import React from 'react';

import { makeStyles } from '@material-ui/core';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Koulutustyyppi, KOULUTUS_TYYPPI } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const hasNimike = (tyyppi?: Koulutustyyppi) =>
  ![
    KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA,
    KOULUTUS_TYYPPI.AMM_OSAAMISALA,
    KOULUTUS_TYYPPI.TUVA,
    KOULUTUS_TYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
    KOULUTUS_TYYPPI.VAPAA_SIVISTYSTYO_MUU,
    KOULUTUS_TYYPPI.TELMA,
  ].includes(tyyppi as Koulutustyyppi);

type Props = {
  nimikkeet: Array<Translateable>;
  koulutustyyppi?: Koulutustyyppi;
  laajuus: string;
};

export const KoulutusInfoGrid = ({ nimikkeet, koulutustyyppi, laajuus }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const perustiedotData = [];
  if (hasNimike(koulutustyyppi)) {
    const nimikeString = nimikkeet
      ? nimikkeet.map((nimikeObj) => localize(nimikeObj)).join('\n')
      : t('koulutus.ei-tutkintonimiketta');
    perustiedotData.push({
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tutkintonimikkeet'),
      text: nimikeString,
    });
  }

  const koulutusTyyppiString = koulutustyyppi
    ? t(`koulutus.tyyppi-${koulutustyyppi}`)
    : '';

  perustiedotData.push({
    icon: <ExtensionOutlinedIcon className={classes.koulutusInfoGridIcon} />,
    title: t('koulutus.koulutustyyppi'),
    text: koulutusTyyppiString,
    testid: 'koulutustyyppi',
  });
  perustiedotData.push({
    icon: <TimelapseIcon className={classes.koulutusInfoGridIcon} />,
    title: t('koulutus.koulutuksen-laajuus'),
    text: laajuus,
    testid: 'opintojenLaajuus',
  });

  return <InfoGrid gridData={perustiedotData} />;
};
