type ValinnainenArvoSana = number | null;

export interface Kouluaine {
  nimi: string;
  arvosana: number | null;
  valinnaisetArvosanat: Array<ValinnainenArvoSana>;
  painoarvo: number | null;
}
