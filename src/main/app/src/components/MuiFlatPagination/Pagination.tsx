import * as React from 'react';

import { PropTypes, StandardProps } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import clsx from 'clsx';

import { computePages, PagePosition, Position } from './core';
import { PageButton, PageButtonClassKey, PageVariant } from './PageButton';

export type PaginationClassKey = PageButtonClassKey;

const styles = createStyles<PaginationClassKey, PaginationProps>({
  root: {},
  rootCurrent: {},
  rootEllipsis: {},
  rootEnd: {},
  rootStandard: {},
  label: {},
  text: {},
  textPrimary: {},
  textSecondary: {},
  colorInherit: {},
  colorInheritCurrent: {},
  colorInheritOther: {},
  disabled: {},
  sizeSmall: {},
  sizeSmallCurrent: {},
  sizeSmallEllipsis: {},
  sizeSmallEnd: {},
  sizeSmallStandard: {},
  sizeLarge: {},
  sizeLargeCurrent: {},
  sizeLargeEllipsis: {},
  sizeLargeEnd: {},
  sizeLargeStandard: {},
  fullWidth: {},
});

export interface RenderButtonProps {
  offset: number;
  page: number;
  children: React.ReactNode;
}

export interface PaginationProps
  extends StandardProps<
    React.HTMLAttributes<HTMLDivElement>,
    PaginationClassKey,
    'onClick'
  > {
  limit: number;
  offset: number;
  total: number;
  centerRipple?: boolean;
  component?: string | React.ComponentType<Partial<PaginationProps>>;
  currentPageColor?: PropTypes.Color;
  disabled?: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  innerButtonCount?: number;
  nextPageLabel?: React.ReactNode;
  onClick?: (ev: React.MouseEvent<HTMLElement>, offset: number, page: number) => void;
  renderButton?: (props: RenderButtonProps) => React.ReactElement;
  otherPageColor?: PropTypes.Color;
  outerButtonCount?: number;
  previousPageLabel?: React.ReactNode;
  reduced?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const UnstyledPagination: React.FunctionComponent<
  PaginationProps & WithStyles<PaginationClassKey>
> = ({
  limit = 1,
  offset = 0,
  total = 0,
  centerRipple = false,
  classes,
  className: classNameProp,
  component = 'div',
  currentPageColor = 'secondary',
  disabled = false,
  disableFocusRipple = false,
  disableRipple = false,
  fullWidth = false,
  innerButtonCount: innerButtonCountProp = 2,
  nextPageLabel = '>',
  onClick,
  otherPageColor = 'primary',
  outerButtonCount: outerButtonCountProp = 2,
  previousPageLabel = '<',
  reduced = false,
  renderButton,
  size = 'medium',
  ...other
}) => {
  const { root, ...buttonClasses } = classes;

  const className = clsx(root, classNameProp);

  const innerButtonCount = reduced ? 1 : innerButtonCountProp;
  const outerButtonCount = reduced ? 1 : outerButtonCountProp;

  const Component = component;
  return (
    <Component className={className} {...other}>
      {computePages(limit, offset, total, innerButtonCount, outerButtonCount).map(
        (pp: PagePosition) => {
          let key: React.Attributes['key'];
          let children: React.ReactNode;
          let pageVariant: PageVariant;
          switch (pp.position) {
            case Position.Current:
              key = pp.position;
              children = pp.page;
              pageVariant = 'current';
              break;
            case Position.LowEllipsis:
            case Position.HighEllipsis:
              key = -pp.position;
              children = '...';
              pageVariant = 'ellipsis';
              break;
            case Position.LowEnd:
            case Position.HighEnd:
              key = -pp.position;
              children =
                pp.position === Position.LowEnd ? previousPageLabel : nextPageLabel;
              pageVariant = 'end';
              break;
            default:
              key = pp.page;
              children = pp.page;
              pageVariant = 'standard';
              break;
          }

          return (
            <PageButton
              limit={limit}
              page={pp.page}
              total={total}
              centerRipple={centerRipple}
              classes={buttonClasses}
              currentPageColor={currentPageColor}
              disabled={disabled}
              disableFocusRipple={disableFocusRipple}
              disableRipple={disableRipple}
              fullWidth={fullWidth}
              key={key}
              onClick={onClick}
              renderButton={renderButton}
              otherPageColor={otherPageColor}
              pageVariant={pageVariant}
              size={size}>
              {children}
            </PageButton>
          );
        }
      )}
    </Component>
  );
};

export const MuiFlatPagination: React.ComponentType<PaginationProps> = withStyles(
  styles,
  {
    name: 'MuiFlatPagination',
  }
)(UnstyledPagination);
