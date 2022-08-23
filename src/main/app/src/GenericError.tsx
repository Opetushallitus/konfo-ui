
interface Translation {
  fi: string,
  sv: string,
  en: string
}

const errorTitle: Translation = {
  fi: 'Virhe',
  sv: 'Errore',
  en: 'Error'
}

const errorText: Translation = {
  fi: 'Tapahtui virhe',
  sv: 'Ö',
  en: 'Error occurred'
}

const buttonText: Translation = {
  'fi': 'Takaisin pääsivulle',
  'sv': 'Öööö',
  'en': 'Back to main'
}

const GenericError = () => {

  const getLang = (): string => {
    const location = window.location;
    let lang = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];
    if (['fi', 'sv', 'en'].includes('' + lang)) {
      return '' + lang
    }
    return document.documentElement.lang || 'fi'
  }

  const lang: string = getLang();

  console.log(lang)

  const toMain = () => window.location.pathname = `/konfo/${lang}/`;

  return (
    <div id='global-react-error-wrapper'>
      <h1>{errorTitle[lang as keyof Translation]}</h1>
      <p>{errorText[lang as keyof Translation]}</p>
      <button onClick={toMain}>{buttonText[lang as keyof Translation]}</button>
    </div>
  )
}

export default GenericError
