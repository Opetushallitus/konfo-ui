import { LocalStorable } from '../LocalStorageUtil';
export interface Kouluaine {
  nimi: string;
  arvosana: number | null;
  valinnaisetArvosanat: Array<number | null>;
  painokerroin: string;
  description: string | null;
}

export const createKouluaine = (
  nimi: string,
  description: string | null = null
): Kouluaine => {
  return {
    nimi,
    arvosana: null,
    valinnaisetArvosanat: [],
    painokerroin: '',
    description,
  };
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
    createKouluaine('kouluaineet.uskonto'),
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
