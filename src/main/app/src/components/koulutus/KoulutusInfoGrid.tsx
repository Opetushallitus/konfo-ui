import React from 'react';

import {
  ExtensionOutlined,
  LineStyle,
  SchoolOutlined,
  Timelapse,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { ExternalLink } from '#/src/components/common/ExternalLink';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Koulutustyyppi } from '#/src/constants';
import { hasTutkintonimike } from '#/src/tools/hasTutkintonimike';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

const PREFIX = 'KoulutusInfoGrid';

const classes = {
  koulutusInfoGridIcon: `${PREFIX}-koulutusInfoGridIcon`,
  koulutuksenTasoTooltip: `${PREFIX}-koulutuksenTasoTooltip`,
};

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  [`& .${classes.koulutusInfoGridIcon}`]: {
    color: theme.palette.primary.main,
  },

  [`& .${classes.koulutuksenTasoTooltip}`]: {
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
  const { t } = useTranslation();

  const perustiedotData = [];
  if (hasTutkintonimike(koulutustyyppi)) {
    const nimikeString = nimikkeet
      ? nimikkeet.map((nimikeObj) => localize(nimikeObj)).join('\n')
      : t('koulutus.ei-tutkintonimiketta');
    perustiedotData.push({
      icon: <SchoolOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tutkintonimikkeet'),
      text: nimikeString,
    });
  }

  const koulutusTyyppiString = koulutustyyppi
    ? t(`koulutus.tyyppi-${koulutustyyppi}`)
    : '';

  perustiedotData.push({
    icon: <ExtensionOutlined className={classes.koulutusInfoGridIcon} />,
    title: t('koulutus.koulutustyyppi'),
    text: koulutusTyyppiString,
    testid: 'koulutustyyppi',
  });
  perustiedotData.push({
    icon: <Timelapse className={classes.koulutusInfoGridIcon} />,
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
      icon: <LineStyle className={classes.koulutusInfoGridIcon} />,
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

  return (
    <Root>
      <InfoGrid gridData={perustiedotData} />
    </Root>
  );
};
