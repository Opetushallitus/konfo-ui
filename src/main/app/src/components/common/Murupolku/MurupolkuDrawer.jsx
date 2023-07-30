import React from 'react';

import { Box, Drawer, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';

import { MurupolkuFragment } from './MurupolkuFragment';

const PREFIX = 'MurupolkuDrawer';

const classes = {
  drawerToolbar: `${PREFIX}-drawerToolbar`,
  drawer: `${PREFIX}-drawer`,
  drawerContainer: `${PREFIX}-drawerContainer`,
  drawerItemWrapper: `${PREFIX}-drawerItemWrapper`,
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  [`& .${classes.drawerToolbar}`]: {
    ...theme.mixins.toolbar,
    color: colors.white,
    backgroundColor: theme.palette.primary.main,
  },

  [`& .${classes.drawer}`]: {
    height: '100%',
    width: '100%',
    minWidth: 0,
  },

  [`& .${classes.drawerContainer}`]: {
    overflowY: 'auto',
    padding: 0,
    minWidth: 0,
  },

  [`& .${classes.drawerItemWrapper}`]: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${colors.lightGrey}`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

const FRAGMENT_INDENT_STEP = 10;

export const MurupolkuDrawer = ({ path, onClose, isOpen }) => {
  const { t } = useTranslation();

  return (
    <StyledDrawer
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
                <MaterialIcon icon="close" />
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
              key={`${name} ${link}`}
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
    </StyledDrawer>
  );
};
