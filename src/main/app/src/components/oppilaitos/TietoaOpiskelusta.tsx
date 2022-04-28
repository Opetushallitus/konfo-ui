import React from 'react';

import { Container, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type Props = {
  heading: string;
  tietoaOpiskelusta: Array<{
    otsikko: Translateable;
    teksti: Translateable;
  }>;
};

export const TietoaOpiskelusta = ({ heading, tietoaOpiskelusta = [] }: Props) => {
  const { t } = useTranslation();

  return (
    <PageSection heading={heading}>
      {tietoaOpiskelusta.length > 0 ? (
        <Container maxWidth="md">
          <Accordion
            items={tietoaOpiskelusta.map((lisatieto) => ({
              title: localize(lisatieto.otsikko),
              content: sanitizedHTMLParser(localize(lisatieto.teksti)),
            }))}
          />
        </Container>
      ) : (
        <Typography variant="h6">{t('oppilaitos.ei-tietoa-opiskelusta')}</Typography>
      )}
    </PageSection>
  );
};
