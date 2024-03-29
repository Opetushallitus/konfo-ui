const withStartingSlash = (str: string) => (str.startsWith('/') ? str : '/' + str);

export const localizeHref = (href: string | undefined | null, lng: string) => {
  // Jos linkissä on protokolla, ei muuteta linkkiä
  if (!href || href === '') {
    return '';
  } else if (href.includes('://') || href.startsWith('#')) {
    return href;
  } else {
    // linkkien baseURL on "/konfo/", joten se voidaan poistaa linkin alusta
    const hrefWithoutKonfo = href.replace(/^\/?(konfo)(\/|$)/, '');
    if (/^\/?(fi|sv|en)(\/|$)/.test(hrefWithoutKonfo)) {
      return withStartingSlash(hrefWithoutKonfo);
    } else {
      // Lisätään kieli URL:ään, koska se puuttuu
      return `/${lng}${withStartingSlash(hrefWithoutKonfo)}`;
    }
  }
};
