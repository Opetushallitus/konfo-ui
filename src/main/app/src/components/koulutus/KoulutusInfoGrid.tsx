import React from 'react';

import { makeStyles } from '@material-ui/core';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { useTranslation } from 'react-i18next';

import { KOULUTUS_TYYPPI } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { InfoGrid } from '../common/InfoGrid';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
}));

const hasNimike = (tyyppi?: string) =>
  tyyppi !== KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA &&
  tyyppi !== KOULUTUS_TYYPPI.AMM_OSAAMISALA &&
  tyyppi !== KOULUTUS_TYYPPI.TUVA;

type Props = {
  nimikkeet: Array<Translateable>;
  koulutustyyppi?: string;
  laajuus: string;
  className?: string;
};

export const KoulutusInfoGrid = ({
  className,
  nimikkeet,
  koulutustyyppi,
  laajuus,
}: Props) => {
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

  return (
    <InfoGrid
      heading={t('koulutus.tiedot')}
      gridData={perustiedotData}
      className={className}
    />
  );
};
