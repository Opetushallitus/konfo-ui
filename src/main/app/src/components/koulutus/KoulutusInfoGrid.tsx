import React from 'react';

import { makeStyles } from '@material-ui/core';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import { useTranslation } from 'react-i18next';

import { ExternalLink } from '#/src/components/common/ExternalLink';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Koulutustyyppi } from '#/src/constants';
import { hasTutkintonimike } from '#/src/tools/hasTutkintonimike';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

const useStyles = makeStyles((theme) => ({
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
  koulutuksenTasoTooltip: {
    ...theme.typography.body1,
    margin: '5px 5px 5px 5px',
  },
}));

type Props = {
  nimikkeet: Array<Translateable>;
  koulutustyyppi?: Koulutustyyppi;
  laajuus: string;
  eqf: Array<Koodi>;
  nqf: Array<Koodi>;
};

export const KoulutusInfoGrid = ({
  nimikkeet,
  koulutustyyppi,
  laajuus,
  eqf,
  nqf,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const perustiedotData = [];
  if (hasTutkintonimike(koulutustyyppi)) {
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

  const eqfString =
    eqf?.length > 0
      ? t('koulutus.koulutuksen-tasot.eqf').concat(
          ': ',
          localizeArrayToCommaSeparated(eqf, { sorted: true })
        )
      : undefined;
  const nqfString =
    nqf?.length > 0
      ? t('koulutus.koulutuksen-tasot.nqf').concat(
          ': ',
          localizeArrayToCommaSeparated(nqf, { sorted: true })
        )
      : undefined;
  const koulutuksenTasot = [eqfString, nqfString].filter(Boolean).join('\n');
  if (koulutuksenTasot) {
    perustiedotData.push({
      icon: <LineStyleIcon className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-tasot.otsikko'),
      text: koulutuksenTasot,
      testid: 'koulutuksenTasot',
      modalText: (
        <div className={classes.koulutuksenTasoTooltip}>
          {t('koulutus.koulutuksen-tasot.tooltip.teksti')}{' '}
          <ExternalLink href={t('koulutus.koulutuksen-tasot.tooltip.linkki.url')}>
            {t('koulutus.koulutuksen-tasot.tooltip.linkki.teksti')}
          </ExternalLink>
        </div>
      ),
    });
  }

  return <InfoGrid gridData={perustiedotData} />;
};
