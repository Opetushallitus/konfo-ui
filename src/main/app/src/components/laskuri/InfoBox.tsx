import React from 'react';

import { Box, Hidden, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors, educationTypeColorCode } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { theme } from '#/src/theme';

const PREFIX = 'InfoBox__';

const classes = {
  infoBox: `${PREFIX}infobox`,
  infoIcon: `${PREFIX}__infobox__icon`,
};

export const InfoBox = () => {
  const { t } = useTranslation();
  return (
    <Box
      className={classes.infoBox}
      sx={{
        maxWidth: '982px',
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        padding: '0.8rem',
        paddingRight: '0.9rem',
        backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
        marginBottom: '1rem',
        [`.${classes.infoIcon}`]: {
          marginRight: '8px',
          color: colors.brandGreen,
          [theme.breakpoints.down('sm')]: {
            marginRight: '4px',
            verticalAlign: 'text-bottom',
          },
        },
      }}>
      <Hidden smDown>
        <MaterialIcon icon="info" variant="outlined" className={classes.infoIcon} />
      </Hidden>
      <Typography variant="body1">
        <Hidden smUp>
          <MaterialIcon icon="info" variant="outlined" className={classes.infoIcon} />
        </Hidden>
        {t('pistelaskuri.graafi.info')}
        <span style={{ fontWeight: 600 }}>
          &nbsp;{t('pistelaskuri.graafi.info-rohkaisu')}
        </span>
      </Typography>
    </Box>
  );
};
