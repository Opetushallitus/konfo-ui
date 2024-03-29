import { Alkamiskausi, Koodi, Osoite, Translateable } from './common';

export type FormatoituAikaleima = {
  fi: string;
  sv: string;
  en: string;
};

// Ei ole sama asia kuin oppilaitoksen, koska oppilaitoksella on erikseen posti- ja käyntiosoite
type LiitteenYhteystiedot = {
  osoite: Osoite;
  sahkoposti: string;
  puhelinnumero: string;
  verkkosivu: string;
};

export type Liite = {
  id: string;
  kuvaus: Translateable;
  nimi: Translateable;
  toimitusaika: string;
  formatoituToimitusaika: FormatoituAikaleima;
  toimitustapa: string;
  toimitusosoite: LiitteenYhteystiedot;
  tyyppi: Koodi;
};

export type KoodiUrit = {
  oppiaine: { koodiUri: string; nimi: Translateable };
  kieli: { koodiUri: string; nimi: Translateable };
};

export type PainotettuArvosana = {
  koodit: KoodiUrit;
  painokerroin: number;
};

export type Hakuaika = {
  alkaa: string;
  paattyy: string;
  formatoituAlkaa: FormatoituAikaleima;
  formatoituPaattyy: FormatoituAikaleima;
};

export type ValintatapajonoTyyppi = {
  koodiUri: string;
  nimi: {
    sv: string;
    en: string;
    fi: string;
  };
};

export type PisteHistoria = {
  pisteet: number;
  vuosi: string;
  valintatapajonoTyyppi: ValintatapajonoTyyppi | null;
};

export type Metadata = {
  pistehistoria?: Array<PisteHistoria>;
};

export type Hakukohde = {
  aloituspaikat: {
    lukumaara?: number;
    ensikertalaisille?: number;
    kuvaus?: Translateable;
  };
  hakuajat: Array<Hakuaika>;
  hakukohdeOid: string;
  hakuOid: string;
  hakukohteenLinja?: {
    alinHyvaksyttyKeskiarvo: number;
    linja?: Koodi;
    lisatietoa: Translateable;
    painotetutArvosanat: Array<PainotettuArvosana>;
    painotetutArvosanatOppiaineittain: Array<PainotettuArvosana>;
  };
  hakulomakeAtaruId: string;
  hakulomakeKuvaus: Translateable;
  hakulomakeLinkki: Translateable;
  hakulomaketyyppi: string;
  isHakuAuki: boolean;
  isHakuMennyt?: boolean;
  jarjestyspaikka: {
    nimi: Translateable;
    oid: string;
    paikkakunta: Koodi;
    jarjestaaUrheilijanAmmKoulutusta: boolean;
  };
  koulutuksenAlkamiskausi: Alkamiskausi;
  nimi: Translateable;
  pohjakoulutusvaatimus: Array<Koodi>;
  pohjakoulutusvaatimusTarkenne: Translateable;
  valintaperusteId?: string;

  liitteet: Array<Liite>;
  liitteetOnkoSamaToimitusaika: boolean;
  liitteetOnkoSamaToimitusosoite: boolean;
  liitteidenToimitusaika: string;
  formatoituLiitteidentoimitusaika: FormatoituAikaleima;
  liitteidenToimitustapa: string;
  liitteidenToimitusosoite: LiitteenYhteystiedot;
  hasValintaperustekuvausData: boolean;
  metadata?: Metadata;
};

export type HakukohdeOid = string;
