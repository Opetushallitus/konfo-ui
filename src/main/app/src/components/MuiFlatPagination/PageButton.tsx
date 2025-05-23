import * as React from 'react';

import { PropTypes, StandardProps, Button, Theme, ButtonProps } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { WithStyles, withStyles, createStyles } from '@mui/styles';
import clsx from 'clsx';

import { colors } from '#/src/colors';

import { getOffset } from './core';
import { RenderButtonProps } from './Pagination';

export type PageButtonClassKey =
  | 'root'
  | 'rootCurrent'
  | 'rootEllipsis'
  | 'rootEnd'
  | 'rootStandard'
  | 'label'
  | 'text'
  | 'textPrimary'
  | 'textSecondary'
  | 'colorInherit'
  | 'colorInheritCurrent'
  | 'colorInheritOther'
  | 'disabled'
  | 'sizeSmall'
  | 'sizeSmallCurrent'
  | 'sizeSmallEllipsis'
  | 'sizeSmallEnd'
  | 'sizeSmallStandard'
  | 'sizeLarge'
  | 'sizeLargeCurrent'
  | 'sizeLargeEllipsis'
  | 'sizeLargeEnd'
  | 'sizeLargeStandard'
  | 'fullWidth';

const styles = (theme: Theme) =>
  createStyles<PageButtonClassKey, PageButtonProps>({
    root: {
      minWidth: 16,
    },
    rootCurrent: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    rootEllipsis: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
    rootEnd: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    rootStandard: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    label: {},
    text: {},
    textPrimary: {},
    textSecondary: {},
    colorInherit: {},
    colorInheritCurrent: {},
    colorInheritOther: {},
    disabled: {},
    sizeSmall: {
      minWidth: 8,
    },
    sizeSmallCurrent: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    sizeSmallEllipsis: {
      paddingLeft: theme.spacing(0.25),
      paddingRight: theme.spacing(0.25),
    },
    sizeSmallEnd: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    sizeSmallStandard: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    sizeLarge: {
      minWidth: 24,
    },
    sizeLargeCurrent: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    sizeLargeEllipsis: {
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(0.75),
    },
    sizeLargeEnd: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    sizeLargeStandard: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    fullWidth: {},
  });

export type PageVariant = 'current' | 'ellipsis' | 'end' | 'standard';

export interface PageButtonProps
  extends StandardProps<ButtonProps, PageButtonClassKey, 'onClick'> {
  limit: number;
  page: number;
  total: number;
  pageVariant: PageVariant;
  currentPageColor?: PropTypes.Color;
  onClick?: (ev: React.MouseEvent<HTMLElement>, offset: number, page: number) => void;
  renderButton?: (props: RenderButtonProps) => React.ReactElement;
  otherPageColor?: PropTypes.Color;
}

const handleClick =
  (
    page: number,
    limit: number,
    onClick: (ev: React.MouseEvent<HTMLElement>, offset: number, page: number) => void
  ) =>
  (ev: React.MouseEvent<HTMLElement>): void => {
    onClick(ev, getOffset(page, limit), page);
  };

const UnstyledPageButton: React.FunctionComponent<
  PageButtonProps & WithStyles<PageButtonClassKey>
> = ({
  limit = 1,
  page = 0,
  total = 0,
  pageVariant = 'standard',
  classes: classesProp,
  currentPageColor,
  disabled: disabledProp = false,
  disableRipple: disableRippleProp = false,
  onClick: onClickProp,
  renderButton,
  otherPageColor,
  size,
  ...other
}) => {
  const isCurrent = pageVariant === 'current';
  const isEllipsis = pageVariant === 'ellipsis';
  const isEnd = pageVariant === 'end';
  const isStandard = pageVariant === 'standard';

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const {
    rootCurrent,
    rootEllipsis,
    rootEnd,
    rootStandard,
    colorInheritCurrent,
    colorInheritOther,
    sizeSmallCurrent,
    sizeSmallEllipsis,
    sizeSmallEnd,
    sizeSmallStandard,
    sizeLargeCurrent,
    sizeLargeEllipsis,
    sizeLargeEnd,
    sizeLargeStandard,
    ...classes
  } = classesProp;
  classes.root = clsx(classes.root, {
    [rootCurrent]: isCurrent,
    [rootEllipsis]: isEllipsis,
    [rootEnd]: isEnd,
    [rootStandard]: isStandard,
  });
  classes.colorInherit = clsx(classes.colorInherit, {
    [colorInheritCurrent]: isCurrent,
    [colorInheritOther]: !isCurrent,
  });
  classes.sizeSmall = clsx(classes.sizeSmall, {
    [sizeSmallCurrent]: isCurrent && isSmall,
    [sizeSmallEllipsis]: isEllipsis && isSmall,
    [sizeSmallEnd]: isEnd && isSmall,
    [sizeSmallStandard]: isStandard && isSmall,
  });
  classes.sizeLarge = clsx(classes.sizeLarge, {
    [sizeLargeCurrent]: isCurrent && isLarge,
    [sizeLargeEllipsis]: isEllipsis && isLarge,
    [sizeLargeEnd]: isEnd && isLarge,
    [sizeLargeStandard]: isStandard && isLarge,
  });
  const color = isCurrent ? currentPageColor : otherPageColor;
  const disabled = disabledProp || isEllipsis || page <= 0 || total <= 0;
  const disableRipple = disableRippleProp || disabled || isCurrent;
  const isClickable = !disabled && (isEnd || isStandard);
  let onClick: ((ev: React.MouseEvent<HTMLElement>) => void) | undefined;
  if (isClickable && onClickProp) {
    onClick = handleClick(page, limit, onClickProp);
  }

  const button = (
    <Button
      sx={{
        '&:focus-visible': {
          boxShadow: `inset 0 0 0 2px ${isCurrent ? colors.brandGreen : colors.grey700}`,
        },
      }}
      classes={classes}
      color={color === 'secondary' ? 'secondary' : 'primary'}
      disabled={disabled}
      disableRipple={disableRipple}
      onClick={onClick}
      size={size}
      aria-current={isCurrent ? 'page' : undefined}
      {...other}
    />
  );

  if (renderButton && isClickable) {
    return renderButton({ offset: getOffset(page, limit), page, children: button });
  }

  return button;
};

export const PageButton: React.ComponentType<PageButtonProps> = withStyles(styles, {
  name: 'MuiFlatPageButton',
})(UnstyledPageButton);
