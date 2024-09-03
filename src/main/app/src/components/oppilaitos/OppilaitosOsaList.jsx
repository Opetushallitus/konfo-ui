import React from 'react';

import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { isEmpty } from 'lodash';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import { ImageCardGrid } from '#/src/components/common/ImageCardGrid';
import { Spacer } from '#/src/components/common/Spacer';

const formToimipisteenNimi = (parentOsa, oppilaitosOsat) => {
  if (parentOsa.parentToimipisteOid && !isEmpty(oppilaitosOsat)) {
    const foundOsa = oppilaitosOsat.find((o) => o.oid === parentOsa.parentToimipisteOid);
    const parentOsanNimi = parentOsa?.nimi;
    if (foundOsa?.nimi) {
      return `${foundOsa.nimi}, ${parentOsanNimi}`;
    } else {
      return parentOsanNimi;
    }
  }
  return parentOsa?.nimi;
};

export const OppilaitosOsaList = (props) => {
  const { oppilaitosOsat, title } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardInfos = oppilaitosOsat
    .map((osa) => ({
      text: formToimipisteenNimi(osa, oppilaitosOsat),
      image: osa?.oppilaitoksenOsa?.teemakuva || DefaultHeroImage,
      link: `/oppilaitososa/${osa.oid}`,
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
