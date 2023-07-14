import React from 'react';

import { Button, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';
import { Opintojakso } from '#/src/types/ToteutusTypes';

const OpintojaksoContent = ({ opintojakso }: { opintojakso: Opintojakso }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h5" sx={{ marginTop: '16px', marginBottom: '16px' }}>
        {t('toteutus.opintojakson-kuvaus')}
      </Typography>
      {sanitizedHTMLParser(localize(opintojakso?.metadata?.kuvaus))}
      <Button
        target="_blank"
        href={`/toteutus/${opintojakso.oid}`}
        variant="outlined"
        size="large"
        color="primary">
        {t('toteutus.lue-lisää-opintojaksosta')}
      </Button>
    </>
  );
};

export const Opintojaksot = ({ opintojaksot }: { opintojaksot: Array<Opintojakso> }) => {
  const { t } = useTranslation();

  return opintojaksot?.length > 0 ? (
    <PageSection heading={t('toteutus.opintojaksot')}>
      <Accordion
        items={opintojaksot.map((opintojakso: any) => ({
          title: (
            <>
              <Link
                style={{ fontWeight: 600 }}
                target="_blank"
                tabIndex={-1}
                underline="none"
                href={`/toteutus/${opintojakso?.oid}`}>
                {localize(opintojakso?.nimi)}
              </Link>
              &#44;&nbsp;
              <Typography>{getLocalizedOpintojenLaajuus(opintojakso)}</Typography>
            </>
          ),
          content: <OpintojaksoContent opintojakso={opintojakso} />,
        }))}
      />
    </PageSection>
  ) : null;
};
