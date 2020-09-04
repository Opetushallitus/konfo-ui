import React, { useState } from 'react';
import clsx from 'clsx';
import { Switch, Route, Redirect } from 'react-router-dom';
import KonfoStore from './stores/konfo-store';
import { Provider } from 'mobx-react';
import Draft from './components/common/Draft';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotFound from './NotFound';
import Etusivu from './components/Etusivu';
import PalautePopup from './components/palaute/PalautePopup';
import SideMenu from './components/common/SideMenu';
import Sisaltohaku from './components/Sisaltohaku';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { theme } from './theme';
import { DRAWER_WIDTH } from './constants';
import Palvelut from './components/palvelu/Palvelut';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import Haku from './components/haku/Haku';
import Koulutus from './components/koulutus/Koulutus';
import Oppilaitos from './components/oppilaitos/Oppilaitos';
import Valintaperusteet from './components/valintaperusteet/Valintaperusteet';
import SivuRouter from './components/sivu/SivuRouter';
import ReactiveBorder from './components/ReactiveBorder';
import Hakupalkki from './components/haku/Hakupalkki';
import Toteutus from './components/toteutus/Toteutus';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '#/src/tools/i18n';
const konfoStore = new KonfoStore();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -DRAWER_WIDTH,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  smContent: {
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: '-100%',
  },
  smContentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const App = () => {
  const classes = useStyles();
  const hakuStore = konfoStore.hakuStore;
  const hakuehtoStore = konfoStore.hakuehtoStore;
  const urlStore = konfoStore.urlStore;
  const restStore = konfoStore.restStore;
  const navigaatioStore = konfoStore.navigaatioStore;
  const vertailuStore = konfoStore.vertailuStore;
  const contentfulStore = konfoStore.contentfulStore;
  const { i18n } = useTranslation();

  const matches = useMediaQuery('(max-width: 600px)');

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };
  const KoulutusHakuBar = () => (
    <div style={{ margin: 'auto', paddingTop: '50px', maxWidth: '1600px' }}>
      <ReactiveBorder>
        <Hakupalkki />
      </ReactiveBorder>
    </div>
  );
  const main = (
    <React.Fragment>
      <Switch>
        <Redirect exact from="/" to={`/${i18n.language}/`} />
        <Route
          path="/:lng"
          component={({ match }) =>
            supportedLanguages.includes(match.params.lng) ? (
              <Switch>
                <Route exact path="/:lng">
                  <Etusivu />
                </Route>
                <Route path="/:lng/sisaltohaku/">
                  <Sisaltohaku />
                </Route>
                <Route path="/:lng/haku/:keyword?">
                  <KoulutusHakuBar />
                  <Haku />
                </Route>
                <Route path="/:lng/koulutus/:oid">
                  <KoulutusHakuBar />
                  <Koulutus />
                </Route>
                <Route path="/:lng/oppilaitos/:oid">
                  <KoulutusHakuBar />
                  <Oppilaitos />
                </Route>
                <Route path="/:lng/toteutus/:oid">
                  <KoulutusHakuBar />
                  <Toteutus />
                </Route>
                <Route path="/:lng/sivu/:id">
                  <KoulutusHakuBar />
                  <SivuRouter />
                </Route>
                <Route path="/:lng/hakukohde/:hakukohdeOid/valintaperuste/:valintaperusteOid">
                  <KoulutusHakuBar />
                  <Valintaperusteet />
                </Route>
              </Switch>
            ) : (
              <Route component={NotFound} />
            )
          }
        />
        <Route component={NotFound} />
      </Switch>
      <Palvelut />
      <Footer />
    </React.Fragment>
  );
  return (
    <Provider
      hakuStore={hakuStore}
      urlStore={urlStore}
      hakuehtoStore={hakuehtoStore}
      restStore={restStore}
      navigaatioStore={navigaatioStore}
      vertailuStore={vertailuStore}
      contentfulStore={contentfulStore}>
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <div className={classes.root}>
            <Draft />
            <Header toggleMenu={toggleMenu} isOpen={menuVisible} />
            <SideMenu small={matches} menuVisible={menuVisible} closeMenu={closeMenu} />
            <main
              id="app-main-content"
              className={clsx(matches ? classes.smContent : classes.content, {
                [matches ? classes.smContentShift : classes.contentShift]: menuVisible,
              })}>
              {main}
            </main>
          </div>
          <PalautePopup />
        </React.Fragment>
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
