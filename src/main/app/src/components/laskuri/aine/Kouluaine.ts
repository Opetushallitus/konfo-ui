export interface Kouluaine {
  nimi: string;
  arvosana: number | null;
  valinnaisetArvosanat: Array<number | null>;
  painokerroin: string;
}

const createKouluaine = (nimi: string): Kouluaine => {
  return { nimi, arvosana: null, valinnaisetArvosanat: [], painokerroin: '' };
};

export class Kouluaineet {
  kielet: Array<Kouluaine> = [
    createKouluaine('Äidinkieli ja kirjallisuus'),
    createKouluaine('A1-kieli'),
    createKouluaine('B1-Kieli'),
  ];
  lisakielet: Array<Kouluaine> = [];
  muutLukuaineet: Array<Kouluaine> = [
    createKouluaine('Matematiikka'),
    createKouluaine('Biologia'),
    createKouluaine('Maantieto'),
    createKouluaine('Fysiikka'),
    createKouluaine('Kemia'),
    createKouluaine('Terveystieto'),
    createKouluaine('Uskonto tai elämänkatsomustieto'),
    createKouluaine('Historia'),
    createKouluaine('Yhteiskuntaoppi'),
  ];
  taitoaineet: Array<Kouluaine> = [
    createKouluaine('Musiikki'),
    createKouluaine('Kuvataide'),
    createKouluaine('Käsityö'),
    createKouluaine('Liikunta'),
    createKouluaine('Kotitalous'),
  ];
}
