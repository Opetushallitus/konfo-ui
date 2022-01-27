import React from 'react';

import {
  Box,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { MurupolkuFragment } from './MurupolkuFragment';

const FRAGMENT_INDENT_STEP = 10;

const useStyles = makeStyles((theme) => ({
  drawerToolbar: {
    ...theme.mixins.toolbar,
    color: colors.white,
    backgroundColor: theme.palette.primary.main,
  },
  drawer: {
    height: '100%',
    width: '100%',
    minWidth: 0,
  },
  drawerContainer: {
    overflowY: 'auto',
    padding: 0,
    minWidth: 0,
  },
  drawerItemWrapper: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${colors.lightGrey}`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

export const MurupolkuDrawer = ({ path, onClose, isOpen }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Drawer
      classes={{ paperAnchorBottom: classes.drawer }}
      anchor="bottom"
      onClose={onClose}
      open={isOpen}>
      <Box display="flex" flexDirection="column">
        <Toolbar variant="dense" disableGutters className={classes.drawerToolbar}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap">
            <Grid item>
              <IconButton color="inherit" onClick={onClose}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="body1" noWrap color="inherit">
                {t('murupolku')}
              </Typography>
            </Grid>
            <Grid item />
          </Grid>
        </Toolbar>
        <Box className={classes.drawerContainer}>
          {path.map(({ name, link, isHome }, index) => (
            <Box
              key={`${name} ${index}`}
              className={classes.drawerItemWrapper}
              style={{ textIndent: `${index * FRAGMENT_INDENT_STEP}px` }}>
              <MurupolkuFragment
                name={name}
                link={link}
                closeDrawer={onClose}
                isHome={isHome}
                isLast={path.length - 1 === index}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};
