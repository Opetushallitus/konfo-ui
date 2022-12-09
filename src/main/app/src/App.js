import React, { useState, useEffect, useLayoutEffect } from 'react';

import { useMediaQuery, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useIsFetching } from 'react-query';
import { Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';

import { CookieModal } from '#/src/components/common/CookieModal';
import SiteImprove from '#/src/components/common/SiteImprove';
import { HeadingBoundary } from '#/src/components/Heading';
import { useSideMenu } from '#/src/hooks';
import { NotFound } from '#/src/NotFound';
import { supportedLanguages } from '#/src/tools/i18n';
import { getLanguage } from '#/src/tools/localization';

import { Draft } from './components/common/Draft';
import Footer from './components/common/Footer';
import { Header } from './components/common/Header';
import { SideMenu } from './components/common/SideMenu';
import { Etusivu } from './components/Etusivu';
import { HakuPage } from './components/haku/HakuPage';
import { Hakupalkki } from './components/haku/Hakupalkki';
import { KoulutusPage } from './components/koulutus/KoulutusPage';
import { OppilaitosPage } from './components/oppilaitos/OppilaitosPage';
import { PalautePopup } from './components/palaute/PalautePopup';
import { Palvelut } from './components/palvelu/Palvelut';
import { ReactiveBorder } from './components/ReactiveBorder';
import { Sisaltohaku } from './components/Sisaltohaku';
import { SivuRouter } from './components/sivu/SivuRouter';
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

const Root = styled('div')(({ betaBannerVisible, isSmall, menuVisible }) => ({
  [`& .${classes.content}`]: {
    marginTop: getHeaderHeight(theme)({ betaBannerVisible, isSmall }),
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
    marginTop: getHeaderHeight(theme)({ betaBannerVisible, isSmall }),
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
}));

const KoulutusHakuBar = () => (
  <div style={{ margin: 'auto', maxWidth: '1600px' }}>
    <ReactiveBorder>
      <Hakupalkki />
    </ReactiveBorder>
  </div>
);

const TranslatedRoutes = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const selectedLanguage = params?.lng;
  useEffect(() => {
    if (supportedLanguages.includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
      Cookies.set('lang', selectedLanguage, {
        expires: 1800,
        path: '/',
      });
    }
  }, [i18n, selectedLanguage]);

  if (!supportedLanguages.includes(selectedLanguage)) {
    let langCookie = Cookies.get('lang');
    const newLocation = {
      ...location,
      pathname: '/' + (langCookie ? langCookie : 'fi') + location.pathname,
    };
    return <Navigate to={newLocation} replace />;
  }

  return supportedLanguages.includes(selectedLanguage) ? (
    <Routes>
      <Route path="/" element={<Etusivu />} />
      <Route path="sisaltohaku/" element={<Sisaltohaku />} />
      <Route
        path="haku/:keyword/*"
        element={
          <>
            <KoulutusHakuBar />
            <HakuPage />
          </>
        }
      />
      <Route
        path="haku/*"
        element={
          <>
            <KoulutusHakuBar />
            <HakuPage />
          </>
        }
      />
      <Route
        path="koulutus/:oid"
        element={
          <>
            <KoulutusHakuBar />
            <KoulutusPage />
          </>
        }
      />
      <Route
        path="oppilaitos/:oid"
        element={
          <>
            <KoulutusHakuBar />
            <OppilaitosPage />
          </>
        }
      />
      <Route
        path="oppilaitososa/:oid"
        element={
          <>
            <KoulutusHakuBar />
            <OppilaitosPage oppilaitosOsa />
          </>
        }
      />
      <Route
        path="toteutus/:oid"
        element={
          <>
            <KoulutusHakuBar />
            <ToteutusPage />
          </>
        }
      />
      <Route
        path="sivu/:id"
        element={
          <>
            <KoulutusHakuBar />
            <SivuRouter />
          </>
        }
      />
      <Route
        path="hakukohde/:hakukohdeOid/valintaperuste"
        element={
          <>
            <KoulutusHakuBar />
            <ValintaperustePage />
          </>
        }
      />
      <Route
        path="valintaperuste/:valintaperusteId"
        element={
          <>
            <KoulutusHakuBar />
            <ValintaperustePreviewPage />
          </>
        }
      />
      <Route element={<NotFound />} />
    </Routes>
  ) : (
    <Routes>
      <Route element={<NotFound />} />
    </Routes>
  );
};

const defaultTitle = (lang) => {
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

const removeLastDot = (str) => {
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

const App = () => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [betaBanner, setBetaBanner] = useState(true);
  const [titleObj, setTitleObj] = useState(null);
  const language = getLanguage();
  const { pathname } = useLocation();
  const { state: menuVisible, toggleMenu, closeMenu } = useSideMenu();
  const isAtEtusivu = useIsAtEtusivu();
  const isFetching = useIsFetching();
  const [sideMenuKey, setSideMenuKey] = useState(1);

  const chatIsVisible = useChat();

  useLayoutEffect(() => {
    const defaultHeader = defaultTitle(language);
    const h1 = removeLastDot(document.querySelector('h1')?.textContent);
    const dontUseDefaultHeader = !(isAtEtusivu || isFetching) && h1;
    const newTitle = dontUseDefaultHeader ? h1 + ' - ' + defaultHeader : defaultHeader;
    const { isDefaultTitle, title, path } = titleObj || { isDefaultTitle: true };
    if (title !== newTitle) {
      const lockTitleOnThisPath = isDefaultTitle || pathname !== path;
      if (lockTitleOnThisPath) {
        document.title = newTitle;
        const titleState = {
          title: newTitle,
          path: pathname,
          isDefaultTitle: !dontUseDefaultHeader,
          lang: language,
        };
        setTitleObj(titleState);
      }
    }
  }, [isFetching, isAtEtusivu, titleObj, language, pathname]);

  return (
    <Root betaBannerVisible={betaBanner} isSmall={isSmall} menuVisible={menuVisible}>
      <Draft />
      <CookieModal />
      <SiteImprove titleObj={titleObj} />
      <Box display="flex">
        <Header
          toggleMenu={toggleMenu}
          isOpen={menuVisible}
          betaBanner={betaBanner}
          setBetaBanner={setBetaBanner}
          refreshSideMenu={() => setSideMenuKey(sideMenuKey + 1)}
        />
        <SideMenu
          isSmall={isSmall}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
          betaBannerVisible={betaBanner}
          key={`sidemenu-key-${sideMenuKey}`}
        />
        <main
          id="app-main-content"
          className={clsx(isSmall ? classes.smContent : classes.content, {
            [classes.contentShift]: menuVisible,
          })}>
          <HeadingBoundary>
            <Routes>
              <Route path="/:lng/*" element={<TranslatedRoutes />} />
              <Route path="*" element={<TranslatedRoutes />} />
            </Routes>
            <Palvelut />
            <Footer />
          </HeadingBoundary>
        </main>
      </Box>
      {!chatIsVisible && <PalautePopup />}
    </Root>
  );
};

export default App;
