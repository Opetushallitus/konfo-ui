import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { Opintokokonaisuus } from '#/src/types/ToteutusTypes';

export const useStyles = makeStyles({
  link: { fontSize: '1.25rem' },
});

export const Opintokokonaisuudet = ({
  opintokokonaisuudet,
}: {
  opintokokonaisuudet: Array<Opintokokonaisuus>;
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return opintokokonaisuudet?.length > 0 ? (
    <PageSection heading={t('toteutus.kuuluu-opintokokonaisuuksiin')}>
      {opintokokonaisuudet.map((opintokokonaisuus) => (
        <LocalizedLink
          className={classes.link}
          tabIndex={-1}
          component={RouterLink}
          to={`/toteutus/${opintokokonaisuus.oid}`}>
          {localize(opintokokonaisuus?.nimi)}
        </LocalizedLink>
      ))}
    </PageSection>
  ) : null;
};
