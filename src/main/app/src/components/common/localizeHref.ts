const withStartingSlash = (str: string) => (str.startsWith('/') ? str : '/' + str);

// Opintopolun kieliversioiden domainit ja niiden kielet
const KONFO_HOSTNAME_LANGUAGES: Record<string, string> = {
  'opintopolku.fi': 'fi',
  'studieinfo.fi': 'sv',
  'studyinfo.fi': 'en',
};

const parseAbsoluteUrl = (href: string) => {
  try {
    return new URL(href);
  } catch {
    return undefined;
  }
};

const isKonfoPath = (pathname: string) => /^\/konfo(\/|$)/.test(pathname);

// Domainin juuri, valinnaisesti kielellä (esim. https://studieinfo.fi/ tai https://opintopolku.fi/sv/)
const ROOT_PATH_REGEX = /^\/(?:(fi|sv|en)\/?)?$/;

// Palauttaa absoluuttista Konfo-osoitetta vastaavan Konfon sisäisen polun tai undefined,
// jos osoite ei ole Konfoon.
const toKonfoPath = (href: string) => {
  const url = parseAbsoluteUrl(href);
  if (!url) {
    return undefined;
  }
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const hostnameLanguage = KONFO_HOSTNAME_LANGUAGES[hostname];
  if (!hostnameLanguage) {
    return undefined;
  }
  const rest = `${url.search}${url.hash}`;
  if (isKonfoPath(url.pathname)) {
    return `${url.pathname}${rest}`;
  }
  // Opintopolun juuresta ohjataan Konfon etusivulle
  const rootMatch = ROOT_PATH_REGEX.exec(url.pathname);
  if (rootMatch) {
    return `/konfo/${rootMatch[1] ?? hostnameLanguage}/${rest}`;
  }
  return undefined;
};

// Onko linkki absoluuttinen osoite Konfoon (esim. https://opintopolku.fi/konfo/fi/sivu/foo
// tai https://studieinfo.fi/)
export const isAbsoluteKonfoUrl = (href: string | undefined | null) =>
  Boolean(href && toKonfoPath(href));

export const localizeHref = (href: string | undefined | null, lng: string) => {
  if (!href || href === '') {
    return '';
  }

  // Absoluuttiset Konfo-linkit muutetaan suhteellisiksi, jotta ne avautuvat sovelluksen sisällä
  const relativeHref = toKonfoPath(href) ?? href;

  // Jos linkissä on protokolla, ei muuteta linkkiä
  if (relativeHref.includes('://') || relativeHref.startsWith('#')) {
    return relativeHref;
  } else {
    // linkkien baseURL on "/konfo/", joten se voidaan poistaa linkin alusta
    const hrefWithoutKonfo = relativeHref.replace(/^\/?(konfo)(\/|$)/, '');
    if (/^\/?(fi|sv|en)(\/|$)/.test(hrefWithoutKonfo)) {
      return withStartingSlash(hrefWithoutKonfo);
    } else {
      // Lisätään kieli URL:ään, koska se puuttuu
      return `/${lng}${withStartingSlash(hrefWithoutKonfo)}`;
    }
  }
};
