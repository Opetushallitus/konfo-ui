import { ThemeProvider } from '@mui/material/styles';
import { OphLanguage } from '@opetushallitus/oph-design-system';
import { useOphTheme } from '@opetushallitus/oph-design-system/theme';

import { SmartLink } from '#/src/components/common/SmartLink';
import { theme as konfoTheme } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';

// Vaihtaa lapsielementtien (esim. sivupohjan sisältöineen ja footereineen) teemaksi
// oph-design-systemin teeman. Header (App.tsx) on tämän ulkopuolella, joten se säilyttää Konfon
// teeman. Sivuvalikko (SideMenu) käärii itsensä tähän erikseen.
// Käytetään ThemeProvideria OphThemeProviderin sijaan, koska jälkimmäinen lisää globaalin CssBaselinen.
export const OphThemeRoute = ({ children }: { children: React.ReactNode }) => {
  const ophTheme = useOphTheme({
    variant: 'opintopolku',
    lang: getLanguage() as OphLanguage,
    overrides: {
      // Konfon omat teemakentät (mui.d.ts), joita yhteiset komponentit odottavat
      headerHeight: konfoTheme.headerHeight,
      breakpoints: { values: konfoTheme.breakpoints.values },
      palette: { inverted: konfoTheme.palette.inverted },
      // Linkit SmartLinkin kautta kuten Konfon teemassa: react-routerin navigointi ja kielietuliite
      components: {
        MuiLink: { defaultProps: { component: SmartLink } },
        MuiButtonBase: { defaultProps: { LinkComponent: SmartLink } },
      },
    },
  });

  return <ThemeProvider theme={ophTheme}>{children}</ThemeProvider>;
};
