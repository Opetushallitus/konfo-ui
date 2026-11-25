import { styled, theme } from '#/src/theme';

const Main = styled('main')({
  // Ei ylämarginaalia headerin kohdalle: DefaultLayout jättää tilan headerille, jotta
  // häiriötiedotteet voidaan näyttää headerin alla ennen <main>-elementtiä.
  minWidth: 0,
  flexGrow: 1,
  padding: 0,
  // Väli footeriin paddingina (ei footerin marginaalina), jotta taustaväri ulottuu footeriin asti
  paddingBottom: theme.spacing(8),
});

// Sivun pääsisältö (<main>). Jokainen sivupohja (layout) renderöi tämän ja footerin itse, jotta
// sivupohjat voivat asetella sisällön ja footerin eri tavoin.
// Sisällön päälle avautuva sivuvalikko (Modal) estää taustan vierityksen, joten sisällön asettelua
// ei tarvitse muuttaa valikon ollessa auki.
export const MainContent = ({ children }: React.PropsWithChildren) => (
  <Main id="app-main-content">{children}</Main>
);
