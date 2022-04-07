import { Hakulomaketyyppi } from '#/src/constants';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { selectHakulomaketyyppi } from './hooks';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';

type Props = { toteutus?: Toteutus };

export const ToteutusHakutiedot = ({ toteutus }: Props) => {
  const hakulomaketyyppi = selectHakulomaketyyppi(toteutus);

  switch (hakulomaketyyppi) {
    case Hakulomaketyyppi.ATARU:
      return <ToteutusHakukohteet toteutus={toteutus} />;
    case Hakulomaketyyppi.MUU:
      return <ToteutusHakuMuu toteutus={toteutus} />;
    case Hakulomaketyyppi.EI_SAHKOISTA:
      return <ToteutusHakuEiSahkoista data={toteutus?.eiSahkoistaHakuData} />;
    default:
      return null;
  }
};
