import React from 'react';

import { Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { ExternalLink } from '#/src/components/common/ExternalLink';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import { InfoGridIcon } from '#/src/components/common/InfoGridIcon';
import { Koulutustyyppi } from '#/src/constants';
import { useVisibleKoulutustyyppi } from '#/src/hooks/useVisibleKoulutustyyppi';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { getLocalizedKoulutusLaajuus } from '#/src/tools/utils';
import { Koodi, Translateable } from '#/src/types/common';

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

  if (!isEmpty(tutkintonimikkeet)) {
    perustiedotData.push({
      icon: <InfoGridIcon icon="school" variant="outlined" />,
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
      icon: <InfoGridIcon icon="extension" variant="outlined" />,
      title: t('koulutus.koulutustyyppi'),
      text: koulutustyyppiString,
      testid: 'koulutustyyppi',
    },
    {
      icon: <InfoGridIcon icon="timelapse" variant="outlined" />,
      title: t('koulutus.koulutuksen-laajuus'),
      text: laajuus,
      testid: 'opintojenLaajuus',
    }
  );

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
      icon: <InfoGridIcon icon="line_style" />,
      title: t('koulutus.koulutuksen-tasot.otsikko'),
      text: koulutuksenTasot,
      testid: 'koulutuksenTasot',
      modalText: (
        <Box sx={{ margin: '5px' }}>
          {t('koulutus.koulutuksen-tasot.tooltip.teksti')}{' '}
          <ExternalLink href={t('koulutus.koulutuksen-tasot.tooltip.linkki.url')}>
            {t('koulutus.koulutuksen-tasot.tooltip.linkki.teksti')}
          </ExternalLink>
        </Box>
      ),
    });
  }

  return <InfoGrid gridData={perustiedotData} />;
};
