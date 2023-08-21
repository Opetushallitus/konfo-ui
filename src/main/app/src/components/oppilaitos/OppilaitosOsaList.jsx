import React from 'react';

import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import { ImageCardGrid } from '#/src/components/common/ImageCardGrid';
import { Spacer } from '#/src/components/common/Spacer';

const formToimipisteenNimi = (osa, oppilaitosOsat) => {
  if (osa.parentToimipisteOid) {
    return `${oppilaitosOsat.find((o) => o.oid === osa.parentToimipisteOid).nimi}, ${
      osa.nimi
    }`;
  }
  return osa.nimi;
};

export const OppilaitosOsaList = (props) => {
  const { oppilaitosOsat, title } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardInfos = oppilaitosOsat
    .map((osa) => ({
      text: formToimipisteenNimi(osa, oppilaitosOsat),
      image: osa?.oppilaitoksenOsa?.teemakuva || DefaultHeroImage,
      link: `/oppilaitos/${osa.oid}`,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
  return (
    <Box mt={isMobile ? 6 : 12} display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h2">{title}</Typography>
      <Spacer />
      <Box mt={isMobile ? 0 : 2}>
        <ImageCardGrid cards={cardInfos} cardIsLink />
      </Box>
    </Box>
  );
};
