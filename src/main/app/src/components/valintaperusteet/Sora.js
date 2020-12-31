import React from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import { toId } from '#/src/tools/Utils';
import { LocalizedHTML } from './LocalizedHTML';
import { useTranslation } from 'react-i18next';

const Headers = ['h1', 'h2', 'h3', 'h4', 'h5'];
const isHeader = (tag) => Headers.includes(tag);
const tagHeaders = (node) => {
  if (isHeader(node.name)) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <Box pb={0.33} pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name} gutterBottom={true}>
          {text}
        </Typography>
      </Box>
    );
  }
};

export const Sora = ({ metadata: { kuvaus } }) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={12}>
          <Box py={2}>
            <Typography variant="h2">
              {t('valintaperuste.hakijan-terveydentila-ja-toimintakyky')}
            </Typography>
          </Box>
          <LocalizedHTML data={kuvaus} transform={tagHeaders} />
        </Grid>
      </Grid>
    </>
  );
};
