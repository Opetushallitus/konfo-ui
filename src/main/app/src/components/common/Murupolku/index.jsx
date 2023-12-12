import React, { useState } from 'react';

import { useTheme, useMediaQuery } from '@mui/material';
import { head, last } from 'lodash';
import { useTranslation } from 'react-i18next';

import { styled } from '#/src/theme';

import { MurupolkuDrawer } from './MurupolkuDrawer';
import { MurupolkuFragment } from './MurupolkuFragment';

const useCollapsingPath = (path) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

  if (isNarrow && path.length > 2) {
    return [head(path), { name: '...', isCollapsedPart: true }, last(path)];
  } else {
    return path;
  }
};

const BreadcrumbList = styled('ol')({
  display: 'flex',
  paddingTop: 0,
  paddingLeft: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  listStyle: 'none',
});

const BreadcrumbListItem = styled('li')({
  display: 'block',
  flex: '0 0 auto',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  minWidth: 0,
  '&:last-child': {
    flex: '1 1 0%',
  },
});

export const Murupolku = ({ path }) => {
  const { t } = useTranslation();

  const homePart = { name: t('etusivu'), link: '/', isHome: true };
  const pathWithHome = [homePart, ...path];

  const collapsingPath = useCollapsingPath(pathWithHome);

  const [drawerState, setDrawerState] = useState(false);

  return (
    <nav aria-label={t('murupolku')}>
      <BreadcrumbList>
        {collapsingPath.map(({ name, link, isCollapsedPart, isHome }, index) => {
          return (
            <BreadcrumbListItem key={`${name} ${link}`}>
              <MurupolkuFragment
                name={name}
                link={link}
                isLast={collapsingPath.length - 1 === index}
                openDrawer={() => setDrawerState(true)}
                isCollapsedPart={isCollapsedPart}
                isHome={isHome}
              />
            </BreadcrumbListItem>
          );
        })}
      </BreadcrumbList>
      <MurupolkuDrawer
        path={pathWithHome}
        isOpen={drawerState}
        onClose={() => setDrawerState(false)}
      />
    </nav>
  );
};
