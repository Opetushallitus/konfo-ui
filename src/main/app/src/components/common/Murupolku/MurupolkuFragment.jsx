import React from 'react';

import { Button, Link, useMediaQuery } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSideMenu } from '#/src/hooks';
import { styled, theme } from '#/src/theme';

const PREFIX = 'MurupolkuFragment';

const classes = {
  home: `${PREFIX}-home`,
  arrow: `${PREFIX}-arrow`,
  link: `${PREFIX}Link`,
  text: `${PREFIX}Text`,
  collapsedPart: `${PREFIX}-collapsedPart`,
};

const Root = styled('span')(({ isLast, isHome }) => ({
  [`& .${classes.home}`]: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    verticalAlign: 'text-bottom',
    fontSize: '22px',
  },

  [`& .${classes.arrow}`]: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    color: colors.grey600,
    fontSize: '12px',
  },

  [`& .${classes.link}`]: {
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    display: 'inline',
    cursor: 'pointer',
    color: colors.brandGreen,
    textDecoration: 'none',
  },

  [`& .${classes.text}`]: {
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    display: 'inline',
    textDecoration: 'none',
    ...(isLast && !isHome
      ? {
          color: theme.palette.text.primary,
          fontWeight: 600,
        }
      : {}),
  },

  [`& .${classes.collapsedPart}`]: {
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    cursor: 'pointer',
    border: `1px solid ${colors.grey500}`,
    padding: '2px 12px',
    lineHeight: '24px',
    minWidth: 0,
    '&:hover, &:active': {
      borderColor: colors.brandGreen,
    },
  },
}));

const BREADCRUMB_ICON_SPACING = '14px';

const SHORT_NAME_AT_LEAST = 20;
const SHORT_NAME_AT_MOST = 40;

const shortenName = (name) => {
  const isLetter = (char) =>
    char.toUpperCase() !== char.toLowerCase() || char.codePointAt(0) > 127;

  const atMost = (s) => {
    if (s && s.length > 0 && s.length > SHORT_NAME_AT_MOST) {
      return s.substring(0, SHORT_NAME_AT_MOST);
    } else {
      return s;
    }
  };

  const cleanUpAndAddDotDotDot = (shorted) => {
    if (shorted && shorted.length > 0) {
      if (isLetter(shorted[shorted.length - 1])) {
        return shorted + '...';
      } else {
        return shorted.substring(0, shorted.length - 1) + '...';
      }
    } else {
      return '...';
    }
  };

  let m = '';
  const re = /\s/g;
  while ((m = re.exec(name)) !== null) {
    const currentIndex = re.lastIndex - m.length;
    if (currentIndex >= SHORT_NAME_AT_LEAST) {
      return cleanUpAndAddDotDotDot(atMost(name.substring(0, currentIndex)));
    }
  }
  return name;
};

export const MurupolkuFragment = ({
  link,
  name,
  isLast,
  openDrawer,
  closeDrawer = () => {},
  isCollapsedPart,
  isHome,
}) => {
  const isXLargeDown = useMediaQuery(theme.breakpoints.down('xl'));
  const { state: menuVisible } = useSideMenu();
  const isInteractiveLink = Boolean(link) && (!isLast || isHome);

  const normalizedName = name?.trim() ?? '';
  const shortenedName =
    isXLargeDown || menuVisible ? shortenName(normalizedName) : normalizedName;

  return (
    <Root isLast={isLast} isHome={isHome}>
      {!isHome && (
        <MaterialIcon
          icon="arrow_forward_ios"
          aria-hidden="true"
          className={classes.arrow}
        />
      )}
      {isCollapsedPart ? (
        <Button className={classes.collapsedPart} onClick={openDrawer}>
          {normalizedName}
        </Button>
      ) : isInteractiveLink ? (
        <Link href={link} className={classes.link} onClick={closeDrawer}>
          {isHome && (
            <MaterialIcon
              icon="home"
              variant="outlined"
              aria-hidden="true"
              className={classes.home}
            />
          )}
          {shortenedName}
        </Link>
      ) : (
        <span className={classes.text} aria-current={isLast ? 'page' : undefined}>
          {isHome && (
            <MaterialIcon
              icon="home"
              variant="outlined"
              aria-hidden="true"
              className={classes.home}
            />
          )}
          {shortenedName}
        </span>
      )}
    </Root>
  );
};
