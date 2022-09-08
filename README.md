# Konfo-UI

Konfo-UI on luotu create-react-app:lla (`src/main/app`). Juuressa oleva Spring Boot 2.0 -sovellus hoitaa lähinnä sovelluksen jakamisen ympäristöihin deplattaessa.

[![Konfo-ui](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml)

## Käyttöliittymän kehittäminen

TL;DR

    cd src/main/app
    npm ci
    npm start

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3005/

## Käyttöliittymän kehittäminen tietyn ympäristön datalla

`src/main/app/package.json` -tiedoston rivi `proxy: <ympäristö>` määrittää minkä ympäristön dataa lokaalisti käynnistyvä konfo-ui käyttää (proxyttämällä). Riviä muokkaamalla pystyy helposti käynnistämään lokaalin konfo-ui:n jonkun tietyn ympäristön datalla e.g. lokaali konfo-backend.

## Koodin tyyli ja tarkistus (ESLint & Prettier)

Käytössä on ESlint ja Prettier koodin tyylin yhdenmukaistamiseksi ja staattiseen tarkistamiseen. Prettier ajetaan eslint-sääntönä, joten prettierin ajaminen JS/TS-tiedostoille erikseen ei ole tarpeen. Lisäksi eslint ajetaan Huskyn ja Lint-staged:n avulla Git precommit-hookissa, jolloin korjataan ne virheet/varoitukset, jotka pystytään. Jos ei kaikkea pystytty korjaamaan, commit epäonnistuu ja käyttäjän täytyy korjata jäljellä olevat ongelmat käsin.

ESLintin voi ajaa käsin komennolla `npm run lint`, tai automaattisen fiksauksen kanssa `npm run lint:fix`.

## Testit

Selainta vasten ajettavat testit (cypress) olettavat kälin löytyvän ajossa portista `3005`. Käyttöliittymätestit käynnistyy komennolla:

    cd src/main/app
    npm run cypress:open

### API-kutsujen mockaaminen

KTO-projektissa on toteutettu omat työkalut API-kutsujen mockauksen helpottamiseen. Työkalut ja niiden dokumentaatio löytyvät [kto-ui-common](https://github.com/Opetushallitus/kto-ui-common)-reposta. `Update-mocks.js`-skriptille on tehty käytön helpottamiseksi npm skripti `update-mocks`, jota siis kutsutaan komennolla `npm run update-mocks`. Muista käynnistää lokaali kehitysproxy (`npm run start`) ennen mockien päivitystä, jotta mockeille tulee oikeaa dataa localhostin kautta.

### Yksikkötestit

`npm test`

Yksikkötestit nimetään päätteellä `.test.js` ja ne luodaan niihin kansioihin missä niiden testaama koodi sijaitsee. Yksikkötestit kannattaa kirjoittaa lähinnä monimutkaisille apufunktioille ja suurin osa testausta pitäisi tehdä cypress-testeinä.

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
