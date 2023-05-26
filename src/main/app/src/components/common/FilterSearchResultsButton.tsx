import React from 'react';

import { FilterList } from '@mui/icons-material';
import { Badge, Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useSideMenu } from '#/src/hooks';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

export const FilterSearchResultsButton = ({
  inline = false,
  textColor,
  chosenFilterCount,
  ...rest
}: {
  textColor?: string;
  chosenFilterCount?: number;
  inline?: boolean;
} & ButtonProps) => {
  const { t } = useTranslation();

  const { width: sideMenuWidth } = useSideMenu();
  const [hakutulosWidth] = useHakutulosWidth();

  return (
    <Button
      sx={{
        fontWeight: 600,
        ...(inline
          ? {
              color: textColor,
            }
          : {
              position: 'fixed',
              zIndex: 1,
              bottom: 30,
              translate: '-50%',
              left: `${sideMenuWidth + Math.round(hakutulosWidth / 2)}px`,
            }),
      }}
      variant={inline ? 'text' : 'contained'}
      endIcon={
        <Badge color="error" badgeContent={chosenFilterCount}>
          <FilterList />
        </Badge>
      }
      {...rest}>
      {t('haku.rajaa-tuloksia')}
    </Button>
  );
};
