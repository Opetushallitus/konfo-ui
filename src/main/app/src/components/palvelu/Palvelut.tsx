import React from 'react';

import { useTranslation } from 'react-i18next';

import { useContentful } from '#/src/hooks/useContentful';
import { usePageSectionGap } from '#/src/hooks/usePageSectionGap';
import { getOne } from '#/src/tools/getOne';

import { Palvelu } from './Palvelu';
import { CondGrid } from '../CondGrid';
import { ContentSection } from '../ContentSection';

type RiviProps = { otsikko: string; kortit?: Array<{ id: string }> };

const Rivi = ({ otsikko, kortit }: RiviProps) => {
  return kortit && kortit?.length > 0 ? (
    <ContentSection
      heading={otsikko}
      sx={{
        overflow: 'hidden',
        paddingBottom: '24px',
      }}>
      <CondGrid container spacing={3}>
        {kortit.map((p) => (
          <Palvelu id={p.id} key={p.id} />
        ))}
      </CondGrid>
    </ContentSection>
  ) : null;
};

export const Palvelut = () => {
  const { t } = useTranslation();

  const { data } = useContentful();
  const { ohjeetJaTuki, palvelut } = data || {};

  const palveluKortit = getOne(palvelut)?.linkit ?? [];
  const ohjeetJaTukiKortit = getOne(ohjeetJaTuki)?.linkit ?? [];

  const pageSectionGap = usePageSectionGap();

  return (
    <CondGrid container mt={pageSectionGap}>
      <Rivi otsikko={t('palvelut.otsikko-muut-palvelut')} kortit={palveluKortit} />
      <Rivi otsikko={t('palvelut.otsikko-ohjeet-ja-tuki')} kortit={ohjeetJaTukiKortit} />
    </CondGrid>
  );
};
