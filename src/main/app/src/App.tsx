import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { useMediaQuery, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { includes } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useIsFetching } from 'react-query';
import {
  Navigate,
  Routes,
  Route,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';

import { CookieModal } from '#/src/components/common/CookieModal';
import { SiteImprove } from '#/src/components/common/SiteImprove';
import { HeadingBoundary } from '#/src/components/Heading';
import { OhjaavaHakuLink } from '#/src/components/ohjaava-haku/OhjaavaHakuLink';
import { useSideMenu } from '#/src/hooks';
import { NotFound } from '#/src/NotFound';
import { styled } from '#/src/theme';
import { supportedLanguages } from '#/src/tools/i18n';
import { getLanguage } from '#/src/tools/localization';

import { Draft } from './components/common/Draft';
import { Footer } from './components/common/Footer';
import { Header } from './components/common/Header';
import { Notification } from './components/common/Notification';
import { SideMenu } from './components/common/SideMenu';
import { SkipToContent } from './components/common/SkipToContent';
import { Etusivu } from './components/Etusivu';
import { Hairiotiedote } from './components/Hairiotiedote';
import { HakuPage } from './components/haku/HakuPage';
import { Hakupalkki } from './components/haku/Hakupalkki';
import { KoulutusPage } from './components/koulutus/KoulutusPage';
import { OhjaavaHakuPage } from './components/ohjaava-haku/OhjaavaHakuPage';
import { OppilaitosPage } from './components/oppilaitos/OppilaitosPage';
import { PalautePopup } from './components/palaute/PalautePopup';
import { Palvelut } from './components/palvelu/Palvelut';
import { ReactiveBorder } from './components/ReactiveBorder';
import { Sisaltohaku } from './components/Sisaltohaku';
import { SivuRouter } from './components/sivu/SivuRouter';
import { SuosikitPage } from './components/SuosikitPage';
import { ToteutusPage } from './components/toteutus/ToteutusPage';
import {
  ValintaperustePage,
  ValintaperustePreviewPage,
} from './components/valintaperusteet/ValintaperustePage';
import { SIDEMENU_WIDTH } from './constants';
import { useIsAtEtusivu } from './store/reducers/appSlice';
import { getHeaderHeight, theme } from './theme';
import { useChat } from './useChat';

const PREFIX = 'App';

const classes = {
  content: `${PREFIX}content`,
  contentShift: `${PREFIX}contentShift`,
  smContent: `${PREFIX}smContent`,
};

const Root = styled('div')(
  ({ menuVisible }: { isSmall?: boolean; menuVisible?: boolean }) => ({
    [`& .${classes.content}`]: {
      marginTop: getHeaderHeight(theme),
      minWidth: 0,
      flexGrow: 1,
      padding: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -SIDEMENU_WIDTH,
    },

    [`& .${classes.contentShift}`]: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },

    [`& .${classes.smContent}`]: {
      marginTop: getHeaderHeight(theme),
      minWidth: 0,
      flexGrow: 1,
      padding: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      position: 'absolute',
      left: 0,
      right: 0,
      overflow: 'hidden',
      top: menuVisible ? 0 : 'auto',
      bottom: menuVisible ? 0 : 'auto',
    },
  })
);

const TranslatedRoute = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const selectedLanguage = params?.lng;
  const isSupportedLanguageSelected = includes(supportedLanguages, selectedLanguage);

  useEffect(() => {
    if (selectedLanguage && isSupportedLanguageSelected) {
      i18n.changeLanguage(selectedLanguage);
      Cookies.set('lang', selectedLanguage, {
        expires: 1800,
        path: '/',
      });
    }
  }, [i18n, selectedLanguage, isSupportedLanguageSelected]);

  if (!isSupportedLanguageSelected) {
    const langCookie = Cookies.get('lang');
    const newLocation = {
      ...location,
      pathname: '/' + (langCookie ? langCookie : 'fi') + location.pathname,
    };

    return <Navigate to={newLocation} replace />;
  }

  return <Outlet />;
};

const KonfoRoutes = () => (
  <Routes>
    <Route path="/:lng?" element={<TranslatedRoute />}>
      <Route
        element={
          <>
            <Hairiotiedote />
            <Outlet />
          </>
        }>
        <Route path="" element={<Etusivu />} />
        <Route path="sisaltohaku" element={<Sisaltohaku />} />
        <Route path="ohjaava-haku" element={<OhjaavaHakuPage />} />
        <Route
          element={
            <>
              <div style={{ margin: 'auto', maxWidth: '1600px' }}>
                <ReactiveBorder>
                  <Hakupalkki />
                  <OhjaavaHakuLink />
                </ReactiveBorder>
              </div>
              <Outlet />
            </>
          }>
          <Route path="suosikit" element={<SuosikitPage />} />
          <Route path="haku/:keyword?" element={<HakuPage />} />
          <Route path="koulutus/:oid" element={<KoulutusPage />} />
          <Route path="oppilaitos/:oid" element={<OppilaitosPage />} />
          <Route path="oppilaitososa/:oid" element={<OppilaitosPage oppilaitosOsa />} />
          <Route path="toteutus/:oid" element={<ToteutusPage />} />
          <Route path="sivu/:id" element={<SivuRouter />} />
          <Route
            path="hakukohde/:hakukohdeOid/valintaperuste"
            element={<ValintaperustePage />}
          />
          <Route
            path="valintaperuste/:valintaperusteId"
            element={<ValintaperustePreviewPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
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
  const chatIsVisible = useChat();

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

  return (
    <Root isSmall={isSmall} menuVisible={menuVisible}>
      <span style={visuallyHidden} id="focus-reset-target" tabIndex={-1} ref={focusRef} />
      <SkipToContent />
      <Draft />
      <CookieModal />
      <SiteImprove titleObj={titleObj} />
      <Box display="flex">
        <Header
          toggleMenu={toggleMenu}
          isOpen={menuVisible}
          refreshSideMenu={() => setSideMenuKey(sideMenuKey + 1)}
        />
        <SideMenu
          isSmall={isSmall}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
          key={`sidemenu-key-${sideMenuKey}`}
        />
        <main
          id="app-main-content"
          className={clsx(isSmall ? classes.smContent : classes.content, {
            [classes.contentShift]: menuVisible,
          })}>
          <HeadingBoundary>
            <KonfoRoutes />
            <HeadingBoundary>
              <Notification />
              <Palvelut />
              <Footer />
            </HeadingBoundary>
          </HeadingBoundary>
        </main>
      </Box>
      {!chatIsVisible && <PalautePopup />}
    </Root>
  );
};
