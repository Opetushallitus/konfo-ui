import { useState } from 'react';

import { useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

import { MurupolkuDrawer } from './MurupolkuDrawer';
import { MurupolkuFragment } from './MurupolkuFragment';
import type { MurupolkuItem, MurupolkuProps } from './types';

const useCollapsingPath = (path: ReadonlyArray<MurupolkuItem>): Array<MurupolkuItem> => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

  if (isNarrow && path.length > 2) {
    return [path[0], { name: '...', isCollapsedPart: true }, path[path.length - 1]];
  } else {
    return [...path];
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

const StyledNav = styled('nav')({
  '.MuiLink-root.Mui-focusVisible': {
    backgroundColor: colors.grey200,
  },
});

export const Murupolku = ({ path }: MurupolkuProps) => {
  const { t } = useTranslation();

  const homePart: MurupolkuItem = { name: t('etusivu'), link: '/', isHome: true };
  const pathWithHome = [homePart, ...path];

  const collapsingPath = useCollapsingPath(pathWithHome);

  const [drawerState, setDrawerState] = useState(false);

  return (
    <StyledNav aria-label={t('murupolku')}>
      <BreadcrumbList>
        {collapsingPath.map(({ name, link, isCollapsedPart, isHome }, index) => {
          return (
            <BreadcrumbListItem key={`${name} ${link ?? ''}`}>
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
    </StyledNav>
  );
};
