import React from 'react';

import { IconButton, makeStyles, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CloseIcon from '@material-ui/icons/Close';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

const useStyles = makeStyles({
  banner: {
    height: '40px',
  },
  bannerText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
    marginRight: '5px',
  },
  linkToOldButton: {
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
  const classes = useStyles();
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
      <ArrowRightAltIcon />
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
      <CloseIcon />
    </IconButton>
  );
};

const BetaBanner = (props) => {
  const classes = useStyles();
  return (
    <Box
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
    </Box>
  );
};

export default BetaBanner;
