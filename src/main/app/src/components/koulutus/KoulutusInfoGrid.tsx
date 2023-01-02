import React from 'react';

import {
  ExtensionOutlined,
  LineStyle,
  SchoolOutlined,
  TimelapseOutlined,
  LabelOutlined,
  Class,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { ExternalLink } from '#/src/components/common/ExternalLink';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
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

type Koulutus = {
  tutkintonimikkeet: Array<Translateable>;
  koulutustyyppi?: Koulutustyyppi;
  laajuus: string;
  eqf: Array<Koodi>;
  nqf: Array<Koodi>;
  isAvoinKorkeakoulutus: boolean;
  opinnonTyyppi: Koodi;
  tunniste: string;
};

type Props = {
  koulutus: Koulutus;
};

export const KoulutusInfoGrid = ({ koulutus }: Props) => {
  const {
    koulutustyyppi,
    eqf,
    nqf,
    isAvoinKorkeakoulutus,
    tutkintonimikkeet,
    opinnonTyyppi,
    tunniste,
  } = koulutus;

  const laajuus = getLocalizedKoulutusLaajuus(koulutus);
  const { t } = useTranslation();

  const perustiedotData = [];

  if (!_.isEmpty(tutkintonimikkeet)) {
    perustiedotData.push({
      icon: <SchoolOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tutkintonimikkeet'),
      text: tutkintonimikkeet
        ? tutkintonimikkeet.map((nimikeObj) => localize(nimikeObj)).join('\n')
        : t('koulutus.ei-tutkintonimiketta'),
    });
  }

  const koulutustyyppiString = useVisibleKoulutustyyppi({
    koulutustyyppi,
    isAvoinKorkeakoulutus,
  });

  perustiedotData.push(
    {
      icon: <ExtensionOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutustyyppi'),
      text: koulutustyyppiString,
      testid: 'koulutustyyppi',
    },
    {
      icon: <TimelapseOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuus,
      testid: 'opintojenLaajuus',
    }
  );

  const opinnonTyyppiText = localize(opinnonTyyppi);

  if (!_.isEmpty(opinnonTyyppiText)) {
    perustiedotData.push({
      icon: <Class className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.opinnonTyyppi'),
      text: opinnonTyyppiText,
    });
  }

  if (!_.isEmpty(tunniste)) {
    perustiedotData.push({
      icon: <LabelOutlined className={classes.koulutusInfoGridIcon} />,
      title: t('koulutus.tunniste'),
      text: tunniste,
    });
  }

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
