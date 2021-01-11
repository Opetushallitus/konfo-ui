import { Badge, Button, ButtonGroup, makeStyles } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';

// TODO: This is mostly copypaste styles from various files
const useStyles = makeStyles(() => ({
  frontPageButton: {
    color: colors.white,
    fontWeight: 600,
  },
  button: {
    marginBottom: '16px',
  },
  buttonRoot: {
    border: 0,
  },
  buttonLabel: {
    color: colors.brandGreen,
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  fixed: {
    position: 'fixed',
    zIndex: 1,
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.brandGreen,
  },
  fixedButtonLabel: {
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
  hitCount,
  chosenFilterCount,
  showFilters,
  handleFiltersShowToggle,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const buttonText = useMemo(() => t('haku.nayta-hakutulos', { count: hitCount }), [
    t,
    hitCount,
  ]);

  return (
    <ButtonGroup classes={{ root: type === 'fixed' ? classes.fixed : classes.button }}>
      {showFilters ? (
        <Button
          classes={{
            label: classes.fixedButtonLabel,
          }}
          onClick={handleFiltersShowToggle}>
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
            label: type === 'KOMO' ? classes.buttonLabel : classes.fixedButtonLabel,
          }}
          onClick={handleFiltersShowToggle}>
          {t('haku.rajaa-tuloksia')}
        </Button>
      )}
    </ButtonGroup>
  );
};
