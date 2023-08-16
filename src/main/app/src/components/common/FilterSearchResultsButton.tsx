import React from 'react';

import { Badge, Button, ButtonProps } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSideMenu } from '#/src/hooks';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

export const FilterSearchResultsButton = ({
  inline = false,
  textColor,
  chosenFilterCount,
  children,
  ...rest
}: {
  textColor?: string;
  chosenFilterCount?: number;
  inline?: boolean;
} & ButtonProps) => {
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
          <MaterialIcon icon="filter_list" />
        </Badge>
      }
      {...rest}>
      {children}
    </Button>
  );
};
