# Ohjaava haku

Ohjaava haku on konfo-uin hakusivun suodatin/rajain-vaihtoehtoja vastaava selkokielisempi versio hausta. Ohjaava haku koostuu kysymyksistä, joihin vastaamalla käyttäjä muodostaa hakukyselyn samaan tapaan kuin rajaimia valitsemalla. Vastausten tuottamat tulokset näytetään hakusivulla kuten normaalissakin haussa.

Ohjaavaa hakua voi konfiguroida `ohjaava-haku.json`ia muokkaamalla. Kyseinen konfiguraatiotiedosto löytyy hakemistosta `/src/main/app`. Uusi kysymys lisätään lisäämällä konfiguraatiotiedostoon uusi objekti, jolle annetaan `id`:ksi konfossa käytetyn rajaimen id, esim. `opetustapa` tai `opetuskieli`. Valinnaisia konfiguraatio-objektille annettavia parametreja ovat

- `useRajainOptionNameFromRajain`: boolean-tyyppisellä parametrilla määritellään käytetäänkö rajaimen mukana tulevaa, koodistossa määriteltyä nimeä rajainvaihtoehdolle. Esim. `koulutusala`-rajaimen vaihtoehtoja ovat koodistosta tulevat koulutusalojen nimet kuten "Tekniikan alat" tai "Yleissivistävä koulutus". HUOM! Jos rajaimen mukana tulevaa nimeä ei haluta käyttää, pitää lokalisointipalveluun lisätä käännökset rajainvaihtoehdoille avaimen `ohjaava-haku.kysymykset` alle. Käännökset tulee lisätä jokaiselle näytettävälle vaihtoehdolle. Alla JSON-muotoinen esimerkki vaadituista käännösavaimista:
```
{
  "ohjaava-haku": {
    "kysymykset": {
      "opetusaika": {
        "otsikko": "Milloin voit opiskella?",
        "vaihtoehdot": {
          "opetusaikakk_1": "Haluan opiskella päivisin.",
          "opetusaikakk_2": "Minulla on paremmin aikaa iltaisin.",
          "opetusaikakk_3": "Toivon että voisin opiskella viikonloppuisin.",
          "opetusaikakk_4": "Yhdistetty päivä- ja iltaopetus sopii minulle.",
          "opetusaikakk_5": "En halua sitoa opiskeluani mihinkään tiettyyn ajankohtaan."
        }
      }
    }
  }
}
```

Myös sellaisille kysymyksille, joille käytetään koodistosta tulevaa rajaimen nimeä, tulee lisätä kysymyksen otsikko `ohjaava-haku.kysymykset.<rajaimen id>.otsikko`-avaimen alle, esim. `ohjaava-haku.kysymykset.pohjakoulutusvaatimus.otsikko: "Mikä on koulutustaustasi?"`.

- `rajainOptionsToBeRemoved`: array-tyyppisen parametrin arvoksi voi lisätä rajainvaihtoehtoja, joita ei haluta näyttää ohjaavassa haussa. Tästä esimerkkinä on "alkamiskausi"-kysymys, jolle ei haluta näyttää "henkilokohtainen" -vaihtoehtoa.

- `optionOrder`: array-tyyppisellä parametrilla voi määritellä rajainvaihtoehtojen järjestyksen kysymysnäkymässä.
