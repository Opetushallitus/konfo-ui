import React from 'react';

import { Typography, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import InfoCardGrid from '#/src/components/common/InfoCardGrid';
import { InfoGrid } from '#/src/components/common/InfoGrid';
import Tree from '#/src/components/common/Tree';
import { useContentful } from '#/src/hooks';

import Sisalto from './Sisalto';

// TODO: Mikä tämä komponentti on? Kovakoodattuja käännöksiä, testitekstillä
const testiTeksti = `Ammatillisia tutkintoja ovat ammatilliset perustutkinnot, ammattitutkinnot ja erikoisammattitutkinnot.  Tässä osiossa kerrotaan yleisesti opinnoista ja tutkinnon suorittamisesta.`;
const uutisHelper = (data, noPics, greenTitle) => {
  if (!data) {
    return;
  }
  return Object.values(data)
    .slice(0, 3)
    .map((e) => ({
      title: e.name,
      text: testiTeksti,
      titleColor: greenTitle ? 'primary' : undefined,
      image: noPics
        ? undefined
        : {
            url: 'http://images.ctfassets.net/4h0h2z8iv5uv/3p31bFzEUEkxtE2fAT7NQY/f2ebe5602b3890d45afd22a4b0fadc17/Screenshot_2019-10-01_at_10.09.36.png',
            title: e.name,
          },
    }));
};

// TODO: module on keyword eikä se saisi olla muuttujannimi
const Module = ({ module }) => {
  const { data } = useContentful();
  if (module.type === 'infoGrid') {
    const { data: infoGridData, id } = data.infoGrid[module.id];
    const gridData = infoGridData ? JSON.parse(infoGridData) : [];
    return <InfoGrid id={id} gridData={gridData} />;
  } else if (module.type === 'uutiset') {
    const { name, id, showImage, greenText } = data.uutiset[module.id];

    return (
      <InfoCardGrid
        id={id}
        title={name}
        cards={uutisHelper(data.uutinen, showImage === 'false', greenText === 'true')}
      />
    );
  } else if (module.type === 'puu') {
    const { name, id, left, right } = data.puu[module.id];
    const { lehti } = data;

    return (
      <Tree
        id={id}
        title={name}
        cardsLeft={left.map(({ id: leftId }) => lehti[leftId])}
        cardsRight={right.map(({ id: rightId }) => lehti[rightId])}
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

export const SivuKooste = ({ id }) => {
  const { data } = useContentful();
  const pageId = id;
  const pads = {
    padding: '25px 90px',
  };
  const kooste = data.sivuKooste[pageId] || {};

  return (
    <main id="main-content" className="center-content" style={pads}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h1">{kooste.name}</Typography>
        {(kooste.modules || []).map((module, index) => (
          <Module module={module} key={`module-${index}`} />
        ))}
      </Box>
    </main>
  );
};
