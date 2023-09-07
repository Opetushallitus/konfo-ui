import React from 'react';

import { IconButton, Typography, Box, Button } from '@mui/material';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const PREFIX = 'BetaBanner';

const classes = {
  banner: `${PREFIX}-banner`,
  bannerText: `${PREFIX}-bannerText`,
  linkToOldButton: `${PREFIX}-linkToOldButton`,
};

const StyledBox = styled(Box)({
  height: '40px',
  [`& .${classes.bannerText}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
    marginRight: '5px',
  },
  [`& .${classes.linkToOldButton}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const Title = () => {
  const { t } = useTranslation();
  return (
    <Typography variant="body1" size="small" noWrap align="right" color="inherit">
      {t('beta-banner.title')}
    </Typography>
  );
};

const LinkToOldOpintopolku = () => {
  const { t, i18n } = useTranslation();

  return (
    <Button
      variant="contained"
      type="link"
      size="small"
      className={classes.linkToOldButton}
      aria-label={t('beta-banner.siirry')}
      href={urls.url(`konfo-backend.old-oppija-${i18n.language}`)}
      color="primary">
      {t('beta-banner.siirry')}
      <MaterialIcon icon="arrow_right_alt" />
    </Button>
  );
};

const CloseBanner = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <IconButton
      aria-label={t('palaute.sulje')}
      size="small"
      color="inherit"
      onClick={onClose}>
      <MaterialIcon icon="close" />
    </IconButton>
  );
};

export const BetaBanner = (props) => {
  return (
    <StyledBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      className={classes.banner}
      bgcolor={colors.darkGreen}>
      <Box flexGrow={1} className={classes.bannerText}>
        <Title />
      </Box>
      <Box flexGrow={1}>
        <LinkToOldOpintopolku />
      </Box>
      <Box flexShrink={1}>
        <CloseBanner {...props} />
      </Box>
    </StyledBox>
  );
};
