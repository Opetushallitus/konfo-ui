import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
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
        <LocalizedLink
          sx={{ fontSize: '1.25rem' }}
          target="_blank"
          tabIndex={-1}
          component={RouterLink}
          to={`/toteutus/${opintokokonaisuus.oid}`}>
          {localize(opintokokonaisuus?.nimi)}
        </LocalizedLink>
      ))}
    </PageSection>
  ) : null;
};
