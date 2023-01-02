import _ from 'lodash';

import { PainotettuArvosana } from '#/src/types/HakukohdeTypes';

import { LocalStorable } from '../LocalStorageUtil';

export const ARVOSANA_VALUES = _.range(10, 3);
export interface Kouluaine {
  nimi: string;
  arvosana: number | null;
  valinnaisetArvosanat: Array<number | null>;
  painokerroin: string;
  longText?: boolean;
  painotettavatoppiaineetlukiossaKoodiUri: string;
}

export interface Kieliaine extends Kouluaine {
  kuvaus: string;
  kieliKoodi?: string | null;
}

export const isKieliaine = (aine: Kouluaine): aine is Kieliaine => 'kuvaus' in aine;

export const createKouluaine = (
  nimi: string,
  painotettavatoppiaineetlukiossaKoodiUri: string,
  longText: boolean = false
): Kouluaine => {
  return {
    nimi,
    arvosana: null,
    valinnaisetArvosanat: [],
    painokerroin: '',
    longText,
    painotettavatoppiaineetlukiossaKoodiUri,
  };
};

export const createKieliaine = (
  nimi: string,
  painotettavatoppiaineetlukiossaKoodiUri: string,
  kuvaus: string
): Kieliaine =>
  Object.assign(createKouluaine(nimi, painotettavatoppiaineetlukiossaKoodiUri), {
    kuvaus,
  });

export const hasInitialValues = (aine: Kouluaine) => {
  const initialAine = createKouluaine(
    aine.nimi,
    aine.painotettavatoppiaineetlukiossaKoodiUri,
    aine.longText
  );
  return _.isEqual(aine, initialAine);
};

export class Kouluaineet implements LocalStorable {
  kielet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.aidinkieli', 'painotettavatoppiaineetlukiossa_ai'),
    createKieliaine(
      'kouluaineet.a1-kieli',
      'painotettavatoppiaineetlukiossa_a1',
      'pistelaskuri.aine.kielikuvaukset.a1'
    ),
    createKieliaine(
      'kouluaineet.b1-kieli',
      'painotettavatoppiaineetlukiossa_b1',
      'pistelaskuri.aine.kielikuvaukset.b1'
    ),
  ];
  lisakielet: Array<Kouluaine> = [];
  muutLukuaineet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.matematiikka', 'painotettavatoppiaineetlukiossa_ma'),
    createKouluaine('kouluaineet.biologia', 'painotettavatoppiaineetlukiossa_bi'),
    createKouluaine('kouluaineet.maantieto', 'painotettavatoppiaineetlukiossa_ge'),
    createKouluaine('kouluaineet.fysiikka', 'painotettavatoppiaineetlukiossa_fy'),
    createKouluaine('kouluaineet.kemia', 'painotettavatoppiaineetlukiossa_ke'),
    createKouluaine('kouluaineet.terveystieto', 'painotettavatoppiaineetlukiossa_te'),
    createKouluaine('kouluaineet.uskonto', 'painotettavatoppiaineetlukiossa_kt', true),
    createKouluaine('kouluaineet.historia', 'painotettavatoppiaineetlukiossa_hi'),
    createKouluaine('kouluaineet.yhteiskuntaoppi', 'painotettavatoppiaineetlukiossa_yh'),
  ];
  taitoaineet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.musiikki', 'painotettavatoppiaineetlukiossa_mu'),
    createKouluaine('kouluaineet.kuvataide', 'painotettavatoppiaineetlukiossa_ku'),
    createKouluaine('kouluaineet.kasityo', 'painotettavatoppiaineetlukiossa_ks'),
    createKouluaine('kouluaineet.liikunta', 'painotettavatoppiaineetlukiossa_li'),
    createKouluaine('kouluaineet.kotitalous', 'painotettavatoppiaineetlukiossa_ko'),
  ];
  suorittanut: boolean = true;
}

export const kopioiKouluaineetPainokertoimilla = (
  kouluaineet: Kouluaineet,
  painotetutArvosanat: Array<PainotettuArvosana>
): Kouluaineet => {
  const setPainokerroinIfMatches = (aine: Kouluaine): Kouluaine => {
    const matchingPa = painotetutArvosanat.find((pa: PainotettuArvosana) =>
      pa.koodit.oppiaine.koodiUri.startsWith(
        aine.painotettavatoppiaineetlukiossaKoodiUri || 'äöy'
      )
    );
    if (matchingPa) {
      return Object.assign(
        { ...aine },
        { painokerroin: String(matchingPa.painokerroin) }
      );
    } else {
      return aine;
    }
  };
  const modifiedKouluaineet = { ...kouluaineet };
  modifiedKouluaineet.kielet = modifiedKouluaineet.kielet.map(setPainokerroinIfMatches);
  modifiedKouluaineet.lisakielet = modifiedKouluaineet.lisakielet.map(
    setPainokerroinIfMatches
  );
  modifiedKouluaineet.muutLukuaineet = modifiedKouluaineet.muutLukuaineet.map(
    setPainokerroinIfMatches
  );
  modifiedKouluaineet.taitoaineet = modifiedKouluaineet.taitoaineet.map(
    setPainokerroinIfMatches
  );
  return modifiedKouluaineet;
};
