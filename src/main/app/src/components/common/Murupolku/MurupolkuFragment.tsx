import { Button, Link, useMediaQuery } from '@mui/material';
import { isString } from 'lodash';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSideMenu } from '#/src/hooks';
import { styled, theme } from '#/src/theme';

import type { MurupolkuFragmentProps } from './types';

const PREFIX = 'MurupolkuFragment';

const classes = {
  home: `${PREFIX}-home`,
  arrow: `${PREFIX}-arrow`,
  link: `${PREFIX}Link`,
  text: `${PREFIX}Text`,
  collapsedPart: `${PREFIX}-collapsedPart`,
};

type RootProps = {
  isLast: boolean;
  isHome?: boolean;
};

const Root = styled('span', {
  shouldForwardProp: (propName) => !['isLast', 'isHome'].includes(propName as string),
})<RootProps>(({ isLast, isHome }) => ({
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

const shortenName = (name: string) => {
  const isLetter = (char: string) =>
    char.toUpperCase() !== char.toLowerCase() || (char.codePointAt(0) ?? 0) > 127;

  const atMost = (s: string) => {
    if (s && s.length > 0 && s.length > SHORT_NAME_AT_MOST) {
      return s.substring(0, SHORT_NAME_AT_MOST);
    } else {
      return s;
    }
  };

  const cleanUpAndAddDotDotDot = (shorted: string) => {
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

  let match: RegExpExecArray | null = null;
  const re = /\s/g;
  while ((match = re.exec(name)) !== null) {
    const currentIndex = re.lastIndex - match.length;
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
}: MurupolkuFragmentProps) => {
  const isXLargeDown = useMediaQuery(theme.breakpoints.down('xl'));
  const { state: menuVisible } = useSideMenu();
  const interactiveHref = isString(link) ? link : undefined;
  const isInteractiveLink = Boolean(interactiveHref) && (!isLast || isHome);
  const ariaCurrent = isLast ? 'page' : undefined;

  const normalizedName = name.trim();
  const shortenedName =
    isXLargeDown || menuVisible ? shortenName(normalizedName) : normalizedName;

  const homeIcon = isHome ? (
    <MaterialIcon
      icon="home"
      variant="outlined"
      aria-hidden="true"
      className={classes.home}
    />
  ) : null;

  const renderContent = () => {
    if (isCollapsedPart) {
      return (
        <Button className={classes.collapsedPart} onClick={openDrawer}>
          {normalizedName}
        </Button>
      );
    }

    if (isInteractiveLink) {
      return (
        <Link href={interactiveHref} className={classes.link} onClick={closeDrawer}>
          {homeIcon}
          {shortenedName}
        </Link>
      );
    }

    return (
      <span className={classes.text} aria-current={ariaCurrent}>
        {homeIcon}
        {shortenedName}
      </span>
    );
  };

  return (
    <Root isLast={isLast} isHome={isHome}>
      {!isHome && (
        <MaterialIcon
          icon="arrow_forward_ios"
          aria-hidden="true"
          className={classes.arrow}
        />
      )}
      {renderContent()}
    </Root>
  );
};
