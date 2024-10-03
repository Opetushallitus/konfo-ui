import React from 'react';

import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { MinimalEntity } from '#/src/types/ToteutusTypes';

export const Osaamismerkit = ({
  osaamismerkit,
}: {
  osaamismerkit: Array<MinimalEntity>;
}) => {
  const { t } = useTranslation();

  return osaamismerkit?.length > 0 ? (
    <PageSection
      style={{ textAlign: 'center' }}
      heading={t('toteutus.voi-suorittaa-osaamismerkit')}>
      {osaamismerkit.map((osaamismerkki) => (
        <Link
          key={osaamismerkki.oid}
          sx={{ fontSize: '1.25rem' }}
          target="_blank"
          tabIndex={-1}
          href={`/koulutus/${osaamismerkki.oid}`}>
          {localize(osaamismerkki?.nimi)}
        </Link>
      ))}
    </PageSection>
  ) : null;
};
