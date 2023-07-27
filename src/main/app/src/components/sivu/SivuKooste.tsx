import React from 'react';

import { Typography, Grid, Box } from '@mui/material';

import { InfoCardGrid } from '#/src/components/common/InfoCardGrid';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import { Tree } from '#/src/components/common/Tree';
import { useContentful } from '#/src/hooks/useContentful';
import { CfRecord, ContentfulLink, ContentfulUutinen } from '#/src/types/ContentfulTypes';

import { Sisalto } from './Sisalto';

const uutisHelper = (
  data?: CfRecord<ContentfulUutinen>,
  showImages: boolean = false,
  greenTitle: boolean = false
) => {
  if (!data) {
    return;
  }
  return Object.values(data)
    .slice(0, 3)
    .map((e) => ({
      title: e.name,
      text: e.content,
      titleColor: greenTitle ? 'primary' : undefined,
      image: showImages ? e.image : undefined,
    }));
};

// TODO: module on keyword eikä se saisi olla muuttujannimi
const Module = ({ module }: { module: ContentfulLink }) => {
  const { data } = useContentful();
  if (module.type === 'infoGrid') {
    const { data: infoGridData } = data.infoGrid[module.id];
    const gridData = infoGridData ? JSON.parse(infoGridData) : [];
    return <InfoGrid gridData={gridData} />;
  } else if (module.type === 'uutiset') {
    const { name, id, showImage, greenText } = data.uutiset[module.id];

    return (
      <InfoCardGrid
        id={id}
        title={name}
        cards={uutisHelper(data.uutinen, showImage === 'true', greenText === 'true')}
      />
    );
  } else if (module.type === 'puu') {
    const { name, id, left, right } = data.puu[module.id];
    const { lehti } = data;

    return (
      <Tree
        id={id}
        title={name}
        cardsLeft={left?.map((leftLink) => lehti[leftLink?.id])}
        cardsRight={right?.map((rightLink) => lehti[rightLink?.id])}
      />
    );
  } else if (module.type === 'content') {
    const { content } = data.content[module.id];
    return (
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Sisalto content={content} />
      </Grid>
    );
  } else {
    return null;
  }
};

export const SivuKooste = ({ id }: { id: string }) => {
  const { data } = useContentful();
  const pageId = id;
  const kooste = data.sivuKooste[pageId] || {};

  return (
    <main
      id="main-content"
      className="center-content"
      style={{
        padding: '25px 90px',
      }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h1">{kooste.name}</Typography>
        {/* kooste.modules.type tulee stringinä, mutta oikeasti pitäisi oikeasti olla rajattu tunnetuksi type:ksi kuten ContentfulLink:ssä */}
        {(kooste.modules || []).map((module, index) => (
          <Module module={module as ContentfulLink} key={`module-${index}`} />
        ))}
      </Box>
    </main>
  );
};
