import React from 'react';

import { Button, makeStyles, useMediaQuery } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { theme } from '#/src/theme';
import {useSideMenu} from "#/src/hooks";

const BREADCRUMB_ICON_SPACING = '14px';

const useStyles = makeStyles((theme) => ({
  home: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    verticalAlign: 'text-bottom',
    fontSize: '22px',
  },
  arrow: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    color: colors.lightGrey,
    fontSize: '12px',
  },
  link: ({ isLast, isHome, link }) => ({
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    display: 'inline',
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    ...(link
      ? {
          cursor: 'pointer',
          color: colors.brandGreen,
        }
      : {}),
    ...(isLast && !isHome
      ? {
          color: theme.palette.text.primary,
          pointerEvents: 'none',
          fontWeight: 600,
        }
      : {}),
  }),
  collapsedPart: {
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    cursor: 'pointer',
    border: `1px solid ${colors.lightGrey}`,
    padding: '2px 12px',
    lineHeight: '24px',
    minWidth: 0,
    '&:hover, &:active': {
      borderColor: colors.brandGreen,
    },
  },
}));

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

  var m = '';
  const re = /\s/g;
  while ((m = re.exec(name)) !== null) {
    const currentIndex = re.lastIndex - m.length;
    if (currentIndex >= SHORT_NAME_AT_LEAST) {
      return cleanUpAndAddDotDotDot(atMost(name.substring(0, currentIndex)));
    }
  }
  return name;
};

export const MurupolkuFragment = (props) => {
  const {
    link,
    name,
    isLast,
    openDrawer,
    closeDrawer = () => {},
    isCollapsedPart,
    isHome,
  } = props;
  const classes = useStyles(props);
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const isXLarge = useMediaQuery(theme.breakpoints.down('xl'));
  const { state: menuVisible } = useSideMenu();

  const normalizedName = name ? name.trim() : '';
  const shortenedName =
    isSmall || isMedium || (isLarge && (!isLast || menuVisible)) || (isXLarge && menuVisible && !isLast) ? shortenName(normalizedName) : normalizedName;

  return (
    <span>
      {!isHome && <ArrowForwardIosIcon aria-hidden="true" className={classes.arrow} />}
      {isCollapsedPart ? (
        <Button className={classes.collapsedPart} onClick={openDrawer}>
          {normalizedName}
        </Button>
      ) : (
        <LocalizedLink
          {...(link
            ? {
                component: RouterLink,
                to: link,
              }
            : {
                href: isLast ? window.location.href : undefined,
              })}
          className={classes.link}
          title={normalizedName}
          onClick={closeDrawer}
          aria-current={isLast ? 'location' : undefined}>
          {isHome && <HomeOutlinedIcon aria-hidden="true" className={classes.home} />}
          {shortenedName}
        </LocalizedLink>
      )}
    </span>
  );
};
