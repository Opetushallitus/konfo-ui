import './error.css';
interface Translation {
  fi: string;
  sv: string;
  en: string;
}

const errorTitle: Translation = {
  fi: 'Tapahtui virhe',
  sv: 'Ett fel uppstod',
  en: 'Error',
};

const errorText: Translation = {
  fi: 'Oho, jotain meni pieleen. Yritä myöhemmin uudelleen.',
  sv: 'Oj då, någonting gick fel. Prova på nytt om en stund.',
  en: 'Oops, something went wrong. Please try again later.',
};

const buttonText: Translation = {
  fi: 'Palaa takaisin etusivulle',
  sv: 'Gå tillbaka till startsidan',
  en: 'Return to home page',
};

export const GenericError = () => {
  const getLang = (): string => {
    const location = window.location;
    const lang = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];
    if (['fi', 'sv', 'en'].includes(String(lang))) {
      return String(lang);
    }
    return document.documentElement.lang || 'fi';
  };

  const lang: string = getLang();

  const toMain = () => (window.location.pathname = `/konfo/${lang}/`);

  return (
    <div id="global-react-error-wrapper">
      <h1>{errorTitle[lang as keyof Translation]}</h1>
      <p>{errorText[lang as keyof Translation]}</p>
      <button onClick={toMain}>{buttonText[lang as keyof Translation]}</button>
    </div>
  );
};
