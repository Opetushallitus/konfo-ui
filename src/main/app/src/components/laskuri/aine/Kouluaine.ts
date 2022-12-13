import _ from 'lodash';

import { LocalStorable } from '../LocalStorageUtil';

export const ARVOSANA_VALUES = _.range(10, 3);
export interface Kouluaine {
  nimi: string;
  arvosana: number | null;
  valinnaisetArvosanat: Array<number | null>;
  painokerroin: string;
  description: string | null;
  longText?: boolean;
}

export const createKouluaine = (
  nimi: string,
  description: string | null = null,
  longText: boolean = false
): Kouluaine => {
  return {
    nimi,
    arvosana: null,
    valinnaisetArvosanat: [],
    painokerroin: '',
    description,
    longText,
  };
};

export const hasInitialValues = (aine: Kouluaine) => {
  const initialAine = createKouluaine(aine.nimi, aine.description, aine.longText);
  return _.isEqual(aine, initialAine);
};

export class Kouluaineet implements LocalStorable {
  kielet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.aidinkieli'),
    createKouluaine('kouluaineet.a1-kieli', 'pistelaskuri.aine.kielikuvaukset.a1'),
    createKouluaine('kouluaineet.b1-kieli', 'pistelaskuri.aine.kielikuvaukset.b1'),
  ];
  lisakielet: Array<Kouluaine> = [];
  muutLukuaineet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.matematiikka'),
    createKouluaine('kouluaineet.biologia'),
    createKouluaine('kouluaineet.maantieto'),
    createKouluaine('kouluaineet.fysiikka'),
    createKouluaine('kouluaineet.kemia'),
    createKouluaine('kouluaineet.terveystieto'),
    createKouluaine('kouluaineet.uskonto', null, true),
    createKouluaine('kouluaineet.historia'),
    createKouluaine('kouluaineet.yhteiskuntaoppi'),
  ];
  taitoaineet: Array<Kouluaine> = [
    createKouluaine('kouluaineet.musiikki'),
    createKouluaine('kouluaineet.kuvataide'),
    createKouluaine('kouluaineet.kasityo'),
    createKouluaine('kouluaineet.liikunta'),
    createKouluaine('kouluaineet.kotitalous'),
  ];
}
