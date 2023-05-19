import React, { useMemo } from 'react';

import { FilterList } from '@mui/icons-material';
import { Badge, Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

const PREFIX = 'MobileToggleFiltersButton';

const classes = {
  frontPageButton: `${PREFIX}-frontPageButton`,
  button: `${PREFIX}-button`,
  buttonLabel: `${PREFIX}-buttonLabel`,
  fixed: `${PREFIX}-fixed`,
  fixedButtonLabel: `${PREFIX}-fixedButtonLabel`,
};

const StyledButtonGroup = styled(ButtonGroup, {
  shouldForwardProp: (prop) => prop !== 'hakutulosWidth',
})<{ hakutulosWidth: number }>(({ hakutulosWidth }) => ({
  [`& .${classes.frontPageButton}`]: {
    color: colors.white,
    fontWeight: 600,
  },

  [`& .${classes.button}`]: {
    marginBottom: '16px',
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
    translate: '50%',
    right: `${Math.round(hakutulosWidth / 2)}px`,
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
  const [hakutulosWidth] = useHakutulosWidth();

  // TODO: Spinner when loading would be nice
  return (
    <StyledButtonGroup
      hakutulosWidth={hakutulosWidth}
      className={type === 'fixed' ? classes.fixed : classes.button}>
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
