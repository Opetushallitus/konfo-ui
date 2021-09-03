import { Alkamiskausi, Koodi, Osoite, Translateable } from './common';

// Ei ole sama asia kuin oppilaitoksen, koska oppilaitoksella on erikseen posti- ja käyntiosoite
type LiitteenYhteystiedot = {
  osoite: Osoite;
  sahkoposti: string;
  puhelinnumero: string;
};

export type Liite = {
  id: string;
  kuvaus: Translateable;
  nimi: Translateable;
  toimitusaika: string;
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

export type Hakukohde = {
  aloituspaikat: {
    lukumaara?: number;
    ensikertalaisille?: number;
    kuvaus?: Translateable;
  };
  hakuajat: Array<{ alkaa: string; paattyy: string }>;
  hakukohdeOid: string;
  hakukohteenLinja?: {
    alinHyvaksyttyKeskiarvo: number;
    linja?: Koodi;
    lisatietoa: Translateable;
    painotetutArvosanat: Array<PainotettuArvosana>;
  };
  hakulomakeAtaruId: string;
  hakulomakeKuvaus: Translateable;
  hakulomakeLinkki: Translateable;
  hakulomaketyyppi: string;
  isHakuAuki: boolean;
  jarjestyspaikka: { nimi: Translateable; oid: string; paikkakunta: Koodi };
  koulutuksenAlkamiskausi: Alkamiskausi;
  nimi: Translateable;
  pohjakoulutusvaatimus: Array<Koodi>;
  pohjakoulutusvaatimusTarkenne: Translateable;
  valintaperusteId?: string;

  liitteet: Array<Liite>;
  liitteetOnkoSamaToimitusaika: boolean;
  liitteetOnkoSamaToimitusosoite: boolean;
  liitteidenToimitusaika: string;
  liitteidenToimitustapa: string;
  liitteidenToimitusosoite: LiitteenYhteystiedot;
};
