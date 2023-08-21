import React from 'react';

import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { Opintokokonaisuus } from '#/src/types/ToteutusTypes';

export const Opintokokonaisuudet = ({
  opintokokonaisuudet,
}: {
  opintokokonaisuudet: Array<Opintokokonaisuus>;
}) => {
  const { t } = useTranslation();

  return opintokokonaisuudet?.length > 0 ? (
    <PageSection
      style={{ textAlign: 'center' }}
      heading={t('toteutus.kuuluu-opintokokonaisuuksiin')}>
      {opintokokonaisuudet.map((opintokokonaisuus) => (
        <Link
          key={opintokokonaisuus.oid}
          sx={{ fontSize: '1.25rem' }}
          target="_blank"
          tabIndex={-1}
          href={`/toteutus/${opintokokonaisuus.oid}`}>
          {localize(opintokokonaisuus?.nimi)}
        </Link>
      ))}
    </PageSection>
  ) : null;
};
