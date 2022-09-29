import React from 'react';

import { Button, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { Accordion } from '#/src/components/common/Accordion';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { getLocalizedToteutusLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';
import { Opintojakso } from '#/src/types/ToteutusTypes';

export const useStyles = makeStyles({
  contentHeader: { marginTop: '16px', marginBottom: '16px' },
});

const OpintojaksoContent = ({ opintojakso }: { opintojakso: Opintojakso }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" className={classes.contentHeader}>
        {t('toteutus.opintojakson-kuvaus')}
      </Typography>
      {sanitizedHTMLParser(localize(opintojakso?.metadata?.kuvaus))}
      <Button variant="outlined" size="large" color="primary">
        <LocalizedLink
          tabIndex={-1}
          underline="none"
          component={RouterLink}
          to={`/toteutus/${opintojakso.oid}`}>
          {t('toteutus.lue-lisää-opintojaksosta')}
        </LocalizedLink>
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
          title: `${localize(opintojakso?.nimi)}, ${getLocalizedToteutusLaajuus(
            opintojakso
          )}`,
          content: <OpintojaksoContent opintojakso={opintojakso} />,
        }))}
      />
    </PageSection>
  ) : null;
};
