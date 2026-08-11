import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { useMediaQuery, Box, CssBaseline } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useIsFetching } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';

import { CookieDrawer } from '#/src/components/common/CookieDrawer';
import { CookieModal } from '#/src/components/common/CookieModal';
import { HeadingBoundary } from '#/src/components/Heading';
import { useSideMenu } from '#/src/hooks';
import { styled } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';
import { useChat } from '#/src/useChat';

import { Draft } from './components/common/Draft';
import { Footer } from './components/common/Footer';
import { Header } from './components/common/Header';
import { Notifications } from './components/common/Notifications';
import { SkipToContent } from './components/common/SkipToContent';
import { Palvelut } from './components/palvelu/Palvelut';
import { SIDEMENU_WIDTH } from './constants';
import { useIsAtEtusivu } from './store/reducers/appSlice';
import { getHeaderHeight, theme } from './theme';

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
  ({ isSmall, menuVisible }: { isSmall?: boolean; menuVisible?: boolean }) => ({
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    ...(isSmall ? { overflowX: 'clip' } : {}),
    ...(menuVisible
      ? {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: isSmall ? 0 : SIDEMENU_WIDTH,
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

const MainContent = styled('main')(
  ({ isSmall, menuVisible }: { isSmall?: boolean; menuVisible?: boolean }) => ({
    marginTop: getHeaderHeight(theme),
    minWidth: 0,
    flexGrow: 1,
    padding: 0,
    ...(isSmall && menuVisible
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          overflow: 'hidden',
          top: 0,
          bottom: 0,
        }
      : {}),
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

export const App = () => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [titleObj, setTitleObj] = useState<TitleObject>();
  const language = getLanguage();
  const { pathname } = useLocation();
  const { state: menuVisible, toggleMenu, closeMenu } = useSideMenu();
  const isAtEtusivu = useIsAtEtusivu();
  const isFetching = useIsFetching();
  const [sideMenuKey, setSideMenuKey] = useState(1);

  const focusRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    focusRef?.current?.focus();
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

  useEffect(() => {
    if (isSmall && menuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isSmall, menuVisible]);

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
          isSmall={isSmall}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
          sideMenuKey={sideMenuKey}
        />
        <ContentColumn isSmall={isSmall} menuVisible={menuVisible}>
          <MainContent id="app-main-content" isSmall={isSmall} menuVisible={menuVisible}>
            <HeadingBoundary>
              <MatomoTracker />
              <Outlet />
              <HeadingBoundary>
                <Notifications />
                <Palvelut />
              </HeadingBoundary>
            </HeadingBoundary>
          </MainContent>
          <Footer />
        </ContentColumn>
      </Box>
    </div>
  );
};
