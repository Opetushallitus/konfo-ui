# Konfo-UI

Koulutustarjonnan julkinen käyttöliittymä. React-kirjastolla kehitetty SPA (single page app), jonka varsinainen koodi sijaitsee hakemistossa `src/main/app`. 
Juurihakemiston Spring Boot -kääre tarjoilee SPA:n ympäristökohtaisten asetusten kanssa, kun sovellus asennetaan pilveen.

[![Konfo-ui](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml)

[![Contentful content type check](https://github.com/Opetushallitus/konfo-ui/actions/workflows/contentful-type-check.yml/badge.svg)](https://github.com/Opetushallitus/konfo-ui/actions/workflows/contentful-type-check.yml)

## Esivaatimukset

Asenna koneellesi esim NVM:ää käyttäen:

- Node.js versio 16
- NPM versio 8


## Ajaminen lokaalisti

Frontend-sovellus löytyy hakemistosta `/src/main/app`. Kaikki tämän dokumentin komennot suoritetaan kyseisessä hakemistossa, ellei toisin mainita.

Asenna ensin riippuvuudet ajamalla:

    npm ci

Käynnistä konfo-ui kehityspalvelin:

    npm run start

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3005/konfo

Ympäristömuuttuja OPINTOPOLKU_PROXY_URL määrittää mihin domainiin konfo-ui:sta lähtevät konfo-backend-kyselyt ohjataan lokaalisti ajettaessa. 
Voit luoda itsellesi tiedoston `.env.development.local` ja asettaa muuttujan siellä. Tiedostoa muokkaamalla pystyy helposti käynnistämään lokaalin konfo-ui:n jotakin tiettyä ympäristöä tai lokaalia konfo-backendiä (http://localhost:3006) vasten. Katso mallia tiedostosta `.env.development`.

## Koodin tyyli ja tarkistus (ESLint & Prettier)

Käytössä on ESlint ja Prettier koodin tyylin yhdenmukaistamiseksi ja staattiseen tarkistamiseen. Prettier ajetaan eslint-sääntönä, joten prettierin ajaminen JS/TS-tiedostoille erikseen ei ole tarpeen. Lisäksi eslint ajetaan Huskyn ja Lint-staged:n avulla Git precommit-hookissa, jolloin korjataan ne virheet/varoitukset, jotka pystytään. Jos ei kaikkea pystytty korjaamaan, commit epäonnistuu ja käyttäjän täytyy korjata jäljellä olevat ongelmat käsin.

ESLintin voi ajaa käsin komennolla `npm run lint`, tai automaattisen fiksauksen kanssa `npm run lint:fix`.

## Integraatiotestit

Koko sovellusta vasten ajettavat testit on toteutettu [Playwright](https://playwright.dev)-kirjastolla. 
Ensimmäisellä kerralla, ja aina kun Playwright-riippuvuus päivittyy, täytyy sen käyttämät selaimet riippuvuuksineen asentaa käsin komennolla:

    npx playwright install

Playwright-testit olettavat kälin löytyvän ajossa portista `3005` (ks. otsikko "Käyttöliittymän kehittäminen" yllä).
Jos haluat ajaa **kaikki** testit kannattaa käynnistää ensin sovellus komennolla:

    npm run preview:watch

ja ajaa sitten kaikki testit toisessa terminaalissa komennolla

    npm run playwright

`preview:watch` npm skiripti buildaa sovelluksen jääden tarkkailemaan muutoksia, ja käynnistää testi-palvelimen, joka servaa buildatun sovelluksen.
Testien ajaminen Viten dev-serveriä vasten (`npm run start`) on paljon hitaampaa kuin servattua tuotanto-buildia vasten, ja aikakatkaisuja voi tulla, vaikka rajoja on kasvatettu.

Yksittäisten testien ajamisessa ei ole niin väliä, miten sovellus on käynnistetty (`npm run start` tai `npm run preview:watch`). Kätevintä yksittäisten Playwright-testien ajaminen ja debuggaminen on käyttämällä "Visual Studio Code"-editorissa virallista Playwright-pluginia: https://playwright.dev/docs/getting-started-vscode

Yksittäisiä testejä voi myös ajaa [Playwrightin UI-moodissa](https://playwright.dev/docs/test-ui-mode), jonka saa käynnistettyä komennolla:

    npm run playwright:ui

### Yksikkötestit

Yksikkötestit on toteutettu [Vitest](https://vitest.dev/):llä, ja ne voi ajaa komennolla:

    npm run test

Yksikkötestit nimetään päätteellä `.test.js` tai `.test.ts` ja ne luodaan niihin kansioihin missä niiden testaama koodi sijaitsee. Yksikkötestit kannattaa kirjoittaa lähinnä monimutkaisille apufunktioille ja suurin osa testausta pitäisi tehdä Playwright-testeinä.

## Contentful ja TS-tyypitysten generointi

Konfo-UI lataa sisältöjä Contentful-sisällönhallintajärjestelmästä. Jotta Contentfulin rajapintojen palauttamaa dataa on helpompaa käsitellä konfo-ui:ssa, on niille generoitu TypeScript-tyypitykset käyttäen [cf-content-types-generator](https://github.com/contentful-userland/cf-content-types-generator)-työkalua.
Jos Contentful-sisällön tyypit (content types) muuttuvat, täytyy TS-tyypitykset luoda uudelleen. Etsi AWS:n Secrets Managerista utility-tililtä salaisuus nimellä "Contentful_management_api_token". Lisää seuraavanlaiset rivit `src/main/app/src/.env.local`-tiedostoon:

    CONTENTFUL_SPACE_ID=xxxxxxx
    CONTENTFUL_MANAGEMENT_API_TOKEN=xxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx
    CONTENTFUL_ENVIRONMENT_ID=testi

Korvaa "xxx"-kohdat oikeilla AWS:stä löytyvillä salaisuuksilla. Environment id on "testi" tai "master" (tuotantoympäristö). Vaihtoehtoisesti "space id" löytyy myös suoraan Contentfulista ja voit generoida oman "management API" tokenin Contentfulissa ja käyttää sitä. Kehittäjän Contentful tunnukset löytyvät myös AWS:n Secrets Managerista.

Kun salaisuudet ovat paikallaan, luo tyypitykset npm-skriptillä:

    npm run contentful:typegen

## Spring boot (erikoistapaukset)

**Huom** lokaalidevauksessa ei todennäköisesti tarvitse koskaan käynnistää spring boottia, mutta tässä on ohjeet siihen mikäli tällainen tarve tulee.

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/konfo-ui-0.1.0-SNAPSHOT.jar --spring.config.location=./konfoui-dev.yml`

tai komennolla:

`mvn spring-boot:run`

Sovellus aukeaa osoitteeseen:

http://localhost:8080/
