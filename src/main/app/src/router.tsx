import qs from 'query-string';
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Outlet,
  RouteObject,
} from 'react-router-dom';

import { App } from '#/src/App';
import { Etusivu } from '#/src/components/Etusivu';
import { Hairiotiedote } from '#/src/components/Hairiotiedote';
import { HakuPage } from '#/src/components/haku/HakuPage';
import { Hakupalkki } from '#/src/components/haku/Hakupalkki';
import { KoulutusPage } from '#/src/components/koulutus/KoulutusPage';
import { OhjaavaHakuLink } from '#/src/components/ohjaava-haku/OhjaavaHakuLink';
import { OhjaavaHakuPage } from '#/src/components/ohjaava-haku/OhjaavaHakuPage';
import { OppilaitosPage } from '#/src/components/oppilaitos/OppilaitosPage';
import { ReactiveBorder } from '#/src/components/ReactiveBorder';
import { Sisaltohaku } from '#/src/components/Sisaltohaku';
import { SivuRouter } from '#/src/components/sivu/SivuRouter';
import { SuosikitPage } from '#/src/components/SuosikitPage';
import { SuosikitVertailuPage } from '#/src/components/SuosikitVertailuPage';
import { ToteutusPage } from '#/src/components/toteutus/ToteutusPage';
import { TranslatedRoute } from '#/src/components/TranslatedRoute';
import {
  ValintaperustePage,
  ValintaperustePreviewPage,
} from '#/src/components/valintaperusteet/ValintaperustePage';
import { InitGate } from '#/src/InitGate';
import { NotFound } from '#/src/NotFound';
import { ScrollToTop } from '#/src/ScrollToTop';
import { store } from '#/src/store';
import {
  clearRajainValues,
  setKeyword,
  urlParamsChanged,
} from '#/src/store/reducers/hakutulosSlice';

// Ajetaan aina kun etusivulle navigoidaan (myös selaimen takaisin/eteenpäin-napeilla),
// eli hakutulosvalinnat ovat tyhjät ennen kuin sivu renderöityy - ei vaadi erillistä efektiä.
const resetHakuStateLoader = () => {
  store.dispatch(setKeyword({ keyword: '' }));
  store.dispatch(clearRajainValues());
  return null;
};

// Synkataan URL:n keyword- ja search-parametrit reduxiin ennen kuin haku-sivu renderöityy,
// jolloin suodattimet/hakukenttä eivät välillä näytä väärää (edellistä) tilaa.
const syncHakuParamsLoader = ({ request, params }: LoaderFunctionArgs) => {
  const search = qs.parse(new URL(request.url).search, { parseNumbers: true });
  store.dispatch(urlParamsChanged({ keyword: params.keyword, search }));
  return null;
};

const routes: Array<RouteObject> = [
  {
    element: (
      <InitGate>
        <ScrollToTop />
        <App />
      </InitGate>
    ),
    children: [
      {
        path: ':lng?',
        element: <TranslatedRoute />,
        children: [
          {
            element: (
              <>
                <Hairiotiedote />
                <Outlet />
              </>
            ),
            children: [
              { index: true, element: <Etusivu />, loader: resetHakuStateLoader },
              { path: 'sisaltohaku', element: <Sisaltohaku /> },
              { path: 'ohjaava-haku', element: <OhjaavaHakuPage /> },
              {
                element: (
                  <>
                    <div style={{ margin: 'auto', maxWidth: '1600px' }}>
                      <ReactiveBorder>
                        <Hakupalkki />
                        <OhjaavaHakuLink />
                      </ReactiveBorder>
                    </div>
                    <Outlet />
                  </>
                ),
                children: [
                  { path: 'suosikit', element: <SuosikitPage /> },
                  { path: 'suosikit/vertailu', element: <SuosikitVertailuPage /> },
                  {
                    path: 'haku/:keyword?',
                    element: <HakuPage />,
                    loader: syncHakuParamsLoader,
                  },
                  { path: 'koulutus/:oid', element: <KoulutusPage /> },
                  { path: 'oppilaitos/:oid', element: <OppilaitosPage /> },
                  {
                    path: 'oppilaitososa/:oid',
                    element: <OppilaitosPage oppilaitosOsa />,
                  },
                  { path: 'toteutus/:oid', element: <ToteutusPage /> },
                  { path: 'sivu/:id', element: <SivuRouter /> },
                  {
                    path: 'hakukohde/:hakukohdeOid/valintaperuste',
                    element: <ValintaperustePage />,
                  },
                  {
                    path: 'valintaperuste/:valintaperusteId',
                    element: <ValintaperustePreviewPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes, { basename: '/konfo' });
