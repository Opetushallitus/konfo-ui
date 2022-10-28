import React, { useState } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { Box, styled, Typography, Button } from '@mui/material';

import { educationTypeColorCode, colors } from '#/src/colors';
import { PageSection } from '#/src/components/common/PageSection';

import { KeskiArvoModal } from './KeskiarvoModal';

const PREFIX = 'PisteContainer';

const classes = {
  infoBox: `${PREFIX}__infobox`,
  openButton: `${PREFIX}__openbutton`,
};

const StyledPageSection = styled(PageSection)(() => ({
  [` .${classes.infoBox}`]: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
  },
  [`.${classes.openButton}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
}));

export const PisteContainer = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <StyledPageSection heading="Aiemmat sisäänpääsyn pisteet yhteishaussa">
      <Box className={classes.infoBox}>
        <InfoOutlined />
        <Typography>
          Edellisvuosien alin hyväksytty pistemäärä, jolla oppilaitokseen on päässyt
          opiskelemaan. Tarkista hakukohteesta, järjestetäänkö koulutuksessa lisäksi
          pääsykoe, joka vaikuttaa lopulliseen pistemäärään. Musiikin, tanssin ja
          sirkuksen oppilasvalinta perustuu usein pelkkään pääsykokeeseen. Koulutukseen
          kannattaa hakea, vaikka pistemääräsi ei olisikaan aiempien vuosien tasolla.
        </Typography>
      </Box>
      <Button onClick={() => setModalOpen(true)} className={classes.openButton}>
        Laske pistemääräsi ja vertaa
      </Button>
      <KeskiArvoModal
        open={isModalOpen}
        closeFn={() => setModalOpen(false)}></KeskiArvoModal>
    </StyledPageSection>
  );
};
