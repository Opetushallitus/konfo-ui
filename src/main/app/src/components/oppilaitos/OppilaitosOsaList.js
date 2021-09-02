import React from 'react';

import { Box, Typography, useTheme, useMediaQuery } from '@material-ui/core';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import ImageCardGrid from '#/src/components/common/ImageCardGrid';

import Spacer from '../common/Spacer';

const OppilaitosOsaList = (props) => {
  const { oppilaitosOsat, title } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const cardInfos = oppilaitosOsat.map((osa) => ({
    text: osa.nimi,
    image: osa?.oppilaitoksenOsa?.teemakuva || DefaultHeroImage,
    link: `/oppilaitososa/${osa.oid}`,
  }));
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

export default OppilaitosOsaList;
