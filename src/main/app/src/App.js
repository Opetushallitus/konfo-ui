import React, { useState, useEffect, useLayoutEffect } from 'react';

import { makeStyles, useMediaQuery, Box } from '@material-ui/core';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import { CookieModal } from '#/src/components/common/CookieModal';
import { HeadingBoundary } from '#/src/components/Heading';
import { useSideMenu } from '#/src/hooks';
import { NotFound } from '#/src/NotFound';
import { supportedLanguages } from '#/src/tools/i18n';
import { getLanguage } from '#/src/tools/localization';
import { useOnEtusivu } from '#/src/tools/useOnEtusivu';

import { Draft } from './components/common/Draft';
import Footer from './components/common/Footer';
import { Header } from './components/common/Header';
import { SideMenu } from './components/common/SideMenu';
import { Etusivu } from './components/Etusivu';
import { Haku } from './components/haku/Haku';
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
import { getHeaderHeight, theme } from './theme';

const useStyles = makeStyles((theme) => ({
  content: {
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
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  smContent: (props) => ({
    marginTop: getHeaderHeight(theme)(props),
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
    top: props?.menuVisible ? 0 : 'auto',
    bottom: props?.menuVisible ? 0 : 'auto',
  }),
}));

const KoulutusHakuBar = () => (
  <div style={{ margin: 'auto', maxWidth: '1600px' }}>
    <ReactiveBorder>
      <Hakupalkki />
    </ReactiveBorder>
  </div>
);

const TranslatedRoutes = ({ match, location }) => {
  const { i18n } = useTranslation();
  const selectedLanguage = match.params.lng;

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
    return <Redirect to={newLocation} />;
  }
  return supportedLanguages.includes(selectedLanguage) ? (
    <Switch>
      <Route exact path="/:lng">
        <Etusivu />
      </Route>
      <Route exact path="/:lng/sisaltohaku/">
        <Sisaltohaku />
      </Route>
      <Route exact path="/:lng/haku/:keyword?">
        <KoulutusHakuBar />
        <Haku />
      </Route>
      <Route exact path="/:lng/koulutus/:oid">
        <KoulutusHakuBar />
        <KoulutusPage />
      </Route>
      <Route exact path="/:lng/oppilaitos/:oid">
        <KoulutusHakuBar />
        <OppilaitosPage />
      </Route>
      <Route exact path="/:lng/oppilaitososa/:oid">
        <KoulutusHakuBar />
        <OppilaitosPage oppilaitosOsa />
      </Route>
      <Route exact path="/:lng/toteutus/:oid">
        <KoulutusHakuBar />
        <ToteutusPage />
      </Route>
      <Route exact path="/:lng/sivu/:id">
        <KoulutusHakuBar />
        <SivuRouter />
      </Route>
      <Route exact path="/:lng/hakukohde/:hakukohdeOid/valintaperuste">
        <KoulutusHakuBar />
        <ValintaperustePage />
      </Route>
      <Route exact path="/:lng/valintaperuste/:valintaperusteId">
        <KoulutusHakuBar />
        <ValintaperustePreviewPage />
      </Route>
      <Route component={NotFound} />
    </Switch>
  ) : (
    <Route component={NotFound} />
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
  const [title, setTitle] = useState(null);
  const language = getLanguage();
  const { pathname } = useLocation();
  const { state: menuVisible, toggleMenu, closeMenu } = useSideMenu();
  const { isAtEtusivu } = useOnEtusivu();

  const classes = useStyles({ betaBannerVisible: betaBanner, isSmall, menuVisible });
  useLayoutEffect(() => {
    const defaultHeader = defaultTitle(language);
    const h1 = removeLastDot(document.querySelector('h1')?.textContent);
    const newTitle = !isAtEtusivu && h1 ? h1 + ' - ' + defaultHeader : defaultHeader;
    if (title !== newTitle) {
      document.title = newTitle;
      setTitle(newTitle);
    }
  }, [isAtEtusivu, title, language, pathname]);
  return (
    <React.Fragment>
      <Draft />
      <CookieModal />
      <Box display="flex">
        <Header
          toggleMenu={toggleMenu}
          isOpen={menuVisible}
          betaBanner={betaBanner}
          setBetaBanner={setBetaBanner}
        />
        <SideMenu
          isSmall={isSmall}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
          betaBannerVisible={betaBanner}
        />
        <main
          id="app-main-content"
          className={clsx(isSmall ? classes.smContent : classes.content, {
            [classes.contentShift]: menuVisible,
          })}>
          <HeadingBoundary>
            <Route path="/:lng?" component={TranslatedRoutes} />
            <Palvelut />
            <Footer />
          </HeadingBoundary>
        </main>
      </Box>
      <PalautePopup />
    </React.Fragment>
  );
};

export default App;
