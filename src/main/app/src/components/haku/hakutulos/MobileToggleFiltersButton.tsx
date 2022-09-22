import React, { useMemo } from 'react';

import { FilterList } from '@mui/icons-material';
import { Badge, Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useSideMenu } from '#/src/hooks';

const PREFIX = 'MobileToggleFiltersButton';

const classes = {
  frontPageButton: `${PREFIX}-frontPageButton`,
  button: `${PREFIX}-button`,
  buttonRoot: `${PREFIX}-buttonRoot`,
  buttonLabel: `${PREFIX}-buttonLabel`,
  fixed: `${PREFIX}-fixed`,
  fixedMenuOpen: `${PREFIX}-fixedMenuOpen`,
  fixedButtonLabel: `${PREFIX}-fixedButtonLabel`,
};

const StyledButtonGroup = styled(ButtonGroup)(() => ({
  [`& .${classes.frontPageButton}`]: {
    color: colors.white,
    fontWeight: 600,
  },

  [`& .${classes.button}`]: {
    marginBottom: '16px',
  },

  [`& .${classes.buttonRoot}`]: {
    border: 0,
  },

  [`& .${classes.buttonLabel}`]: {
    color: colors.brandGreen,
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  [`&.${classes.fixed}`]: {
    position: 'fixed',
    zIndex: 1,
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.brandGreen,
  },

  [`& .${classes.fixedMenuOpen}`]: {
    position: 'fixed',
    zIndex: 1,
    bottom: 30,
    left: '65%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.brandGreen,
  },

  [`& .${classes.fixedButtonLabel}`]: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

// TODO: Two separate button components would probably be better idea
type Props = {
  hitCount?: number;
  chosenFilterCount?: number;
  handleFiltersShowToggle: VoidFunction;
  showFilters?: boolean;
  type?: 'frontpage' | 'fixed' | 'KOMO';
};

export const MobileToggleFiltersButton = ({
  type,
  hitCount = 0,
  chosenFilterCount,
  showFilters,
  handleFiltersShowToggle,
}: Props) => {
  const { t } = useTranslation();
  const buttonText = useMemo(
    () => t('haku.nayta-hakutulos', { count: hitCount }),
    [t, hitCount]
  );
  const menuOpen = useSideMenu().state;
  const fixedStyle = menuOpen ? classes.fixedMenuOpen : classes.fixed;
  // TODO: Spinner when loading would be nice
  return (
    <StyledButtonGroup className={type === 'fixed' ? fixedStyle : classes.button}>
      {showFilters ? (
        <Button className={classes.fixedButtonLabel} onClick={handleFiltersShowToggle}>
          {buttonText}
        </Button>
      ) : (
        <Button
          variant={type === 'fixed' ? 'outlined' : 'text'}
          endIcon={
            <Badge color="error" badgeContent={chosenFilterCount}>
              <FilterList />
            </Badge>
          }
          className={classes.frontPageButton}
          classes={{
            text: type === 'KOMO' ? classes.buttonLabel : classes.fixedButtonLabel,
          }}
          onClick={handleFiltersShowToggle}>
          {t('haku.rajaa-tuloksia')}
        </Button>
      )}
    </StyledButtonGroup>
  );
};
