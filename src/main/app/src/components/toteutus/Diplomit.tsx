import React from 'react';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';
import { Lukiodiplomi } from '#/src/types/ToteutusTypes';

const PREFIX = 'Diplomit';

const classes = {
  contentHeader: `${PREFIX}-contentHeader`,
};

const StyledPageSection = styled(PageSection)({
  [`& .${classes.contentHeader}`]: { marginTop: '16px', marginBottom: '16px' },
});

export {};

const ListContent = ({
  leadParagraph,
  items,
}: {
  leadParagraph?: Translateable;
  items: Array<Translateable>;
}) =>
  items?.length > 0 ? (
    <>
      {leadParagraph && <Typography>{localize(leadParagraph)}</Typography>}
      <ul>
        {_.map(items, (item, i) => (
          <li key={i}>{localize(item)}</li>
        ))}
      </ul>
    </>
  ) : null;

const DiplomiContent = ({ diplomi }: { diplomi: Lukiodiplomi }) => {
  const { t } = useTranslation();

  const linkki = localize(diplomi?.linkki);
  const altTeksti = localize(diplomi?.linkinAltTeksti);
  return (
    <>
      <Typography variant="h4" className={classes.contentHeader}>
        {t('toteutus.yleiset-tavoitteet')}
      </Typography>
      <ListContent leadParagraph={diplomi?.tavoitteetKohde} items={diplomi.tavoitteet} />
      <Typography variant="h4">{t('toteutus.keskeiset-sisällöt')}</Typography>
      <ListContent items={diplomi?.sisallot} />
      {!_.isEmpty(linkki) && (
        <ExternalLink target="_blank" rel="noopener" href={linkki}>
          {_.isEmpty(altTeksti) ? t('toteutus.lisätietoa') : altTeksti}
        </ExternalLink>
      )}
    </>
  );
};

export const Diplomit = ({ diplomit }: { diplomit: Array<Lukiodiplomi> }) => {
  const { t } = useTranslation();

  return diplomit?.length > 0 ? (
    <StyledPageSection heading={t('toteutus.lukiodiplomit')}>
      <Accordion
        items={diplomit.map((diplomi: any) => ({
          title: localize(diplomi?.koodi),
          content: <DiplomiContent diplomi={diplomi} />,
        }))}
      />
    </StyledPageSection>
  ) : null;
};
