import React, { useState } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { Box, styled, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode, colors } from '#/src/colors';
import { PageSection } from '#/src/components/common/PageSection';

import { KeskiArvoModal } from './KeskiarvoModal';
import { PisteGraafi } from './PisteGraafi';

const PREFIX = 'PisteContainer__';

const classes = {
  infoBox: `${PREFIX}infobox`,
  openButton: `${PREFIX}openbutton`,
  infoIcon: `${PREFIX}__infobox__icon`,
};

const StyledPageSection = styled(PageSection)(() => ({
  [` .${classes.infoBox}`]: {
    maxWidth: '982px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    padding: '0.8rem',
    paddingRight: '0.9rem',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
    marginBottom: '1rem',
  },
  [`.${classes.openButton}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  [`.${classes.infoIcon}`]: {
    marginRight: '8px',
  },
}));

export const PisteContainer = () => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <StyledPageSection heading={t('pistelaskuri.graafi.heading')}>
      <Box className={classes.infoBox}>
        <InfoOutlined className={classes.infoIcon} />
        <Typography variant="body1">
          {t('pistelaskuri.graafi.info')}
          <span style={{ fontWeight: 600 }}>
            &nbsp;{t('pistelaskuri.graafi.info-rohkaisu')}
          </span>
        </Typography>
      </Box>
      <Button onClick={() => setModalOpen(true)} className={classes.openButton}>
        &nbsp;{t('pistelaskuri.graafi.laske-ja-vertaa')}
      </Button>
      <KeskiArvoModal
        open={isModalOpen}
        closeFn={() => setModalOpen(false)}></KeskiArvoModal>
      <PisteGraafi />
    </StyledPageSection>
  );
};
