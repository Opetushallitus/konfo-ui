import { KOULUTUS_TYYPPI } from '#/src/constants';

import { Koodi, Translateable, TODOType, ValueOf, Alkamiskausi } from './common';
import { Hakukohde } from './HakukohdeTypes';

type KoulutusTyyppi = ValueOf<typeof KOULUTUS_TYYPPI>;

export enum Yksikko {
  EURO = 'euro',
  PROSENTTI = 'prosentti',
}

export type Apuraha = {
  yksikko: Yksikko;
  min?: number;
  max?: number;
  kuvaus?: Translateable;
};

export type Maksullisuustyyppi = 'maksullinen' | 'maksuton' | 'lukuvuosimaksu';

export type Opetus = {
  koulutuksenAlkamiskausi?: Alkamiskausi;
  maksullisuustyyppi?: Maksullisuustyyppi;
  maksullisuusKuvaus?: Translateable;
  maksunMaara?: number;
  onkoApuraha?: boolean;
  apuraha?: Apuraha;
  apurahaKuvaus?: Translateable;
  opetuskieli?: Array<Translateable>;
  opetuskieletKuvaus?: Translateable;
  opetustapa?: Array<Translateable>;
  opetustapaKuvaus?: Translateable;
  opetusaika?: Array<Translateable>;
  opetusaikaKuvaus?: Translateable;
  suunniteltuKestoVuodet?: number;
  suunniteltuKestoKuukaudet?: number;
  suunniteltuKestoKuvaus?: Translateable;
  lisatiedot?: Array<Translateable>;
};

export type Osaamisala = {
  koodi: Koodi;
  linkki: Translateable;
  otsikko: Translateable;
};

export type Yhteyshenkilo = {
  nimi: Translateable;
  puhelinnumero: Translateable;
  sahkoposti: Translateable;
  titteli: Translateable;
  wwwSivu: Translateable;
};

export type Lukiodiplomi = {
  koodi: Koodi;
  sisallot: Array<Translateable>;
  tavoitteetKohde: Translateable;
  tavoitteet: Array<Translateable>;
  linkki: Translateable;
  linkinAltTeksti: Translateable;
};

export type Kielivalikoima = {
  A1Kielet: Array<Translateable>;
  A2Kielet: Array<Translateable>;
  B1Kielet: Array<Translateable>;
  B2Kielet: Array<Translateable>;
  B3Kielet: Array<Translateable>;
  aidinkielet: Array<Translateable>;
  muutKielet: Array<Translateable>;
};

export type ToteutusMetadata = {
  ammattinimikkeet: Array<{ kieli: string; arvo: string }>;
  asiasanat: [];
  kuvaus: Translateable;
  opetus: Opetus;
  osaamisalat: Array<Osaamisala>;
  tyyppi: string;
  yhteyshenkilot: Array<Yhteyshenkilo>;
  painotukset: Array<{ koodi: Koodi; kuvaus: Translateable }>;
  erityisetKoulutustehtavat: Array<{ koodi: Koodi; kuvaus: Translateable }>;
  diplomit: Array<Lukiodiplomi>;
  kielivalikoima: Kielivalikoima;
  ammatillinenPerustutkintoErityisopetuksena: boolean;
  jarjestetaanErityisopetuksena: boolean;
  hakutermi: string;
};

export type Organisaatio = {
  nimi: Translateable;
  oid: string;
  paikkakunta: Koodi;
};

export type Hakutieto = {
  hakuOid: string;
  hakukohteet: Array<Hakukohde>;
  hakutapa: Koodi;
  koulutuksenAlkamiskausi: {
    alkamiskausityyppi: string;
    henkilokohtaisenSuunnitelmanLisatiedot: Translateable;
    koulutuksenAlkamispaivamaara: string;
    koulutuksenPaattymispaivamaara: string;
  };
  nimi: Translateable;
};

export type Toteutus = {
  esikatselu: boolean;
  hakutiedot: Array<Hakutieto>;
  kielivalinta: Array<string>;
  koulutusOid: string;
  metadata: ToteutusMetadata;
  modified: string;
  muokkaaja: { oid: string; nimi: string };
  nimi: Translateable;
  oid: string;
  organisaatio: Organisaatio;
  organisaatiot: Array<string>;
  tarjoajat: Array<Organisaatio>;
  teemakuva: string;
  tila: string;
  timestamp: number;
  oppilaitokset: Array<string>;

  // NOTE: These are given at selector
  hakuAukiType: 'ilmoittautuminen' | 'hakukohde' | null;
  hasMuuHaku: boolean;
  hasEiSahkoistaHaku: boolean;
  eiSahkoistaHakuData: any;
  hakukohteet: any;
  muuHakuData: any;
};

export type Jarjestaja = {
  koulutustyyppi: KoulutusTyyppi;
  kunnat: Array<Koodi>;
  kuva: string;
  kuvaus: Translateable;
  maksunMaara: TODOType;
  nimi: Translateable;
  maksullisuustyyppi: Maksullisuustyyppi;
  opetusajat: Array<Koodi>;
  oppilaitosOid: string;
  oppilaitosTila: string; // TODO: string union type, e.g. "julkaistu" | jne
  toteutusOid: string;
  toteutusNimi: string;
  tutkintonimikkeet: TODOType;
  ammatillinenPerustutkintoErityisopetuksena: boolean;
  jarjestetaanErityisopetuksena: boolean;
  hakuAuki: boolean;
};
