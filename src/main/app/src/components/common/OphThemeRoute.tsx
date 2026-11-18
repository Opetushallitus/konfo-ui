import { ThemeProvider } from '@mui/material/styles';
import { OphLanguage } from '@opetushallitus/oph-design-system';
import { useOphTheme } from '@opetushallitus/oph-design-system/theme';
import { Outlet } from 'react-router-dom';

import { theme as konfoTheme } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';

// Layout-reitti, joka vaihtaa alireittien sisällön käyttämään oph-design-systemin teemaa.
// Header, sivuvalikko ja footer (App.tsx) ovat tämän ulkopuolella, joten ne säilyttävät Konfon teeman.
// Käytetään ThemeProvideria OphThemeProviderin sijaan, koska jälkimmäinen lisää globaalin CssBaselinen.
export const OphThemeRoute = () => {
  const ophTheme = useOphTheme({
    variant: 'opintopolku',
    lang: getLanguage() as OphLanguage,
    overrides: {
      // Konfon omat teemakentät (mui.d.ts), joita yhteiset komponentit odottavat
      headerHeight: konfoTheme.headerHeight,
      breakpoints: { values: konfoTheme.breakpoints.values },
      palette: { inverted: konfoTheme.palette.inverted },
    },
  });

  return (
    <ThemeProvider theme={ophTheme}>
      <Outlet />
    </ThemeProvider>
  );
};
