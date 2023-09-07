import React from 'react';

import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { theme } from '#/src/theme';

import { ShowSearchResultsButton } from './ShowSearchResultsButton';

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  toggleOpen: () => void;
  showResults: () => void;
  clearRajainValues: () => void;
  rajainCount: number;
  resultCount: number;
}>;

export const MobileRajainDrawer = ({
  isOpen,
  toggleOpen,
  showResults,
  clearRajainValues,
  rajainCount,
  resultCount,
  children,
}: Props) => {
  const { t } = useTranslation();

  return (
    <SwipeableDrawer
      sx={{
        '& .MuiDrawer-paper': {
          top: 0,
        },
      }}
      anchor="bottom"
      onClose={toggleOpen}
      onOpen={toggleOpen}
      open={isOpen}>
      <AppBar
        position="relative"
        sx={{ paddingLeft: theme.spacing(1), marginBottom: 0, boxShadow: 'none' }}>
        <Toolbar variant="dense" disableGutters>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap">
            <Grid item>
              <IconButton color="inherit" onClick={toggleOpen}>
                <MaterialIcon icon="close" />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="body1" noWrap color="inherit">
                {t('haku.rajaa-tuloksia')}
              </Typography>
            </Grid>
            <Grid item style={{ paddingRight: '10px' }}>
              {rajainCount > 0 && (
                <Button
                  color="inherit"
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                  onClick={clearRajainValues}>
                  {t('haku.poista-valitut')}
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container sx={{ overflowY: 'scroll', flexGrow: 2 }}>{children}</Container>
      <ShowSearchResultsButton hitCount={resultCount} onClick={showResults} />
    </SwipeableDrawer>
  );
};
