# Konfo-UI

Koulutustarjonnan julkinen käyttöliittymä. React-kirjastolla kehitetty SPA (single page app), jonka varsinainen koodi sijaitsee hakemistossa `src/main/app`. 
Juurihakemiston Spring Boot -kääre tarjoilee SPA:n ympäristökohtaisten asetusten kanssa, kun sovellus asennetaan pilveen.

[![Konfo-ui](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/konfo-ui/actions/workflows/build.yml)

## Käyttöliittymän kehittäminen

TL;DR

    cd src/main/app
    npm ci
    npm start

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3005/

## Käyttöliittymän kehittäminen tietyn ympäristön datalla

Ympäristömuuttuja OPINTOPOLKU_PROXY_URL määrittää mihin domainiin konfo-ui:sta lähtevät konfo-backend-kyselyt ohjataan lokaalisti ajettaessa. 
Voit luoda itsellesi tiedoston `.env.development.local` ja asettaa muuttujan siellä. Tiedostoa muokkaamalla pystyy helposti käynnistämään lokaalin konfo-ui:n jotakin tiettyä ympäristöä tai lokaalia konfo-backendiä vasten.

## Koodin tyyli ja tarkistus (ESLint & Prettier)

Käytössä on ESlint ja Prettier koodin tyylin yhdenmukaistamiseksi ja staattiseen tarkistamiseen. Prettier ajetaan eslint-sääntönä, joten prettierin ajaminen JS/TS-tiedostoille erikseen ei ole tarpeen. Lisäksi eslint ajetaan Huskyn ja Lint-staged:n avulla Git precommit-hookissa, jolloin korjataan ne virheet/varoitukset, jotka pystytään. Jos ei kaikkea pystytty korjaamaan, commit epäonnistuu ja käyttäjän täytyy korjata jäljellä olevat ongelmat käsin.

ESLintin voi ajaa käsin komennolla `npm run lint`, tai automaattisen fiksauksen kanssa `npm run lint:fix`.

## Testit

Selainta vasten ajettavat testit (cypress) olettavat kälin löytyvän ajossa portista `3005` (ks. otsikko "Käyttöliittymän kehittäminen" yllä). Cypress-käyttöliittymä josta voi valita ajettavat testit käynnistyy komennolla:

    cd src/main/app
    npm run cypress:open

Kaikkien testien ajo headlessina:

    npm run cypress:run

Testien ajo toimii Node.js 16 ja NPM 8 versioilla.

**Huom!** Viten kanssa Cypress-testit ovat melko hitaita, jos sovellusta ajetaan `npm run start`-komennolla. (kts. https://github.com/cypress-io/cypress/issues/22968)
Tämän helpottamiseksi on tehty npm-skripti `preview:watch`, joka buildaa sovelluksen jääden tarkkailemaan muutoksia, ja käynnistää testi-palvelimen, joka servaa buildatun sovelluksen.
Näin ajettuna Cypress-testit ovat n. 5 kertaa nopeampia, ja Cypress-testien tekeminen mukavampaa.

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
