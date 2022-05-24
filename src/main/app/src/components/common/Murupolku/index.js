import React, { useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { MurupolkuDrawer } from './MurupolkuDrawer';
import { MurupolkuFragment } from './MurupolkuFragment';

const useStyles = makeStyles(() => ({
  breadcrumb: {
    display: 'flex',
    paddingTop: 0,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    listStyle: 'none',
  },
  item: {
    display: 'block',
    flex: '0 0 auto',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    minWidth: 0,
    '&:last-child': {
      flex: '1 1 0%',
    },
  },
}));

const useCollapsingPath = (path) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

  if (isNarrow && path.length > 2) {
    return [_.head(path), { name: '...', isCollapsedPart: true }, _.last(path)];
  } else {
    return path;
  }
};

const Murupolku = ({ path }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const homePart = { name: t('etusivu'), link: '/', isHome: true };
  const pathWithHome = [homePart, ...path];

  const collapsingPath = useCollapsingPath(pathWithHome);

  const [drawerState, setDrawerState] = useState(false);

  return (
    <nav aria-label={t('murupolku')}>
      <ol className={classes.breadcrumb}>
        {collapsingPath.map(({ name, link, isCollapsedPart, isHome }, index) => {
          return (
            <li key={`${name} ${index}`} className={classes.item}>
              <MurupolkuFragment
                name={name}
                link={link}
                isLast={collapsingPath.length - 1 === index}
                openDrawer={() => setDrawerState(true)}
                isCollapsedPart={isCollapsedPart}
                isHome={isHome}
              />
            </li>
          );
        })}
      </ol>
      <MurupolkuDrawer
        path={pathWithHome}
        isOpen={drawerState}
        onClose={() => setDrawerState(false)}
      />
    </nav>
  );
};

export default Murupolku;
