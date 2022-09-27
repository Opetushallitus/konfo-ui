import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
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
      {sanitizedHTMLParser(localize(opintojakso?.kuvaus))}
    </>
  );
};

export const getOpintojaksoTitle = (opintojakso: Opintojakso) => {
  let opintojenlaajuus = '';
  const opintojenlaajuusnumero = opintojakso?.opintojenLaajuusNumero;
  const opintojenlaajuusyksikko = localize(opintojakso?.opintojenLaajuusyksikko);
  if (opintojenlaajuusnumero && opintojenlaajuusyksikko) {
    opintojenlaajuus = `, ${opintojenlaajuusnumero} ${opintojenlaajuusyksikko}`;
  }

  return `${localize(opintojakso?.nimi)}${opintojenlaajuus}`;
};

export const Opintojaksot = ({ opintojaksot }: { opintojaksot: Array<Opintojakso> }) => {
  const { t } = useTranslation();

  return opintojaksot?.length > 0 ? (
    <PageSection heading={t('toteutus.opintojaksot')}>
      <Accordion
        items={opintojaksot.map((opintojakso: any) => ({
          title: getOpintojaksoTitle(opintojakso),
          content: <OpintojaksoContent opintojakso={opintojakso} />,
        }))}
      />
    </PageSection>
  ) : null;
};
