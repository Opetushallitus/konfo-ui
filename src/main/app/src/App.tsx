import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { Box, CssBaseline } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useIsFetching } from '@tanstack/react-query';
import { matchPath, Outlet, useLocation } from 'react-router-dom';

import { CookieDrawer } from '#/src/components/common/CookieDrawer';
import { CookieModal } from '#/src/components/common/CookieModal';
import { styled } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';
import { useChat } from '#/src/useChat';

import { Draft } from './components/common/Draft';
import { Header } from './components/common/Header';
import { SkipToContent } from './components/common/SkipToContent';
import { SIDEMENU_WIDTH } from './constants';
import { useIsAtEtusivu } from './store/reducers/appSlice';
import { theme } from './theme';
import { useSideMenu } from './hooks/useSideMenu';

declare global {
  interface Window {
    _paq?: Array<any>;
  }
}

const MatomoTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (window._paq) {
      window._paq.push(['setCustomUrl', window.location.pathname]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [location]);

  return null;
};

const ContentColumn = styled('div')(
  ({
    isMenuOverlay,
    menuVisible,
  }: {
    isMenuOverlay?: boolean;
    menuVisible?: boolean;
  }) => ({
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    ...(isMenuOverlay ? { overflowX: 'clip' } : {}),
    ...(menuVisible
      ? {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: isMenuOverlay ? 0 : SIDEMENU_WIDTH,
        }
      : {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0,
        }),
  })
);

const defaultTitle = (lang: string) => {
  switch (lang) {
    case 'en':
      return 'Studyinfo';
    case 'sv':
      return 'Studieinfo';
    case 'fi':
    default:
      return 'Opintopolku';
  }
};

const removeLastDot = (str?: string | null) => {
  if (str) {
    const nStr = str.trim();
    if (nStr.length === 0) {
      return null;
    } else {
      if (nStr[nStr.length - 1] === '.') {
        return nStr.slice(0, -1);
      } else {
        return nStr;
      }
    }
  }
};

type TitleObject = {
  isDefaultTitle?: boolean;
  title?: string;
  path?: string;
};

const HAKU_PATH_PATTERN = '/:lng/haku/:keyword?';

const isOnlyHakuKeywordChange = (previousPathname: string | null, pathname: string) => {
  if (previousPathname == null) {
    return false;
  }
  const previous = matchPath(HAKU_PATH_PATTERN, previousPathname);
  const current = matchPath(HAKU_PATH_PATTERN, pathname);
  return (
    previous != null && current != null && previous.params.lng === current.params.lng
  );
};

export const App = () => {
  const [titleObj, setTitleObj] = useState<TitleObject>();
  const language = getLanguage();
  const { pathname } = useLocation();
  const {
    isMenuOpen: menuVisible,
    isMenuOverlay: isNotFullHD,
    toggleMenu,
    closeMenu,
  } = useSideMenu();
  const isAtEtusivu = useIsAtEtusivu();
  const isFetching = useIsFetching();
  const [sideMenuKey, setSideMenuKey] = useState(1);

  const focusRef = useRef<HTMLSpanElement>(null);
  const previousPathnameRef = useRef<string>(null);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;
    // Hakusanan vaihtuminen hakusivulla (/haku -> /haku/:keyword) ei ole sivunvaihto,
    // joten fokus pidetään hakukentässä.
    if (!isOnlyHakuKeywordChange(previousPathname, pathname)) {
      focusRef?.current?.focus();
    }
  }, [pathname]);

  useLayoutEffect(() => {
    const defaultHeader = defaultTitle(language);
    const h1 = removeLastDot(document.querySelector('h1')?.textContent);
    const dontUseDefaultHeader = !(isAtEtusivu || isFetching) && h1;
    const newTitle = dontUseDefaultHeader ? h1 + ' - ' + defaultHeader : defaultHeader;
    const { isDefaultTitle, title, path }: TitleObject = titleObj || {
      isDefaultTitle: true,
    };
    if (title !== newTitle) {
      const lockTitleOnThisPath = isDefaultTitle || pathname !== path;
      if (lockTitleOnThisPath) {
        document.title = newTitle;
        const titleState = {
          title: newTitle,
          path: pathname,
          isDefaultTitle: !dontUseDefaultHeader,
        };
        setTitleObj(titleState);
      }
    }
  }, [isFetching, isAtEtusivu, titleObj, language, pathname]);

  // Tämä alustaa Elisan chatin käyttöön
  useChat();

  return (
    <div>
      <span style={visuallyHidden} id="focus-reset-target" tabIndex={-1} ref={focusRef} />
      <SkipToContent />
      <CssBaseline />
      <Draft />
      <CookieModal />
      <CookieDrawer />
      <Box display="flex">
        <Header
          toggleMenu={toggleMenu}
          isOpen={menuVisible}
          refreshSideMenu={() => setSideMenuKey(sideMenuKey + 1)}
          isMenuOverlay={isNotFullHD}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
          sideMenuKey={sideMenuKey}
        />
        <ContentColumn isMenuOverlay={isNotFullHD} menuVisible={menuVisible}>
          <MatomoTracker />
          {/* Sivupohja (DefaultLayout tai Etusivu) renderöi pääsisällön (<main>) ja footerin */}
          <Outlet />
        </ContentColumn>
      </Box>
    </div>
  );
};
