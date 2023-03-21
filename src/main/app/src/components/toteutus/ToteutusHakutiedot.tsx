import _ from 'lodash';

import { Hakulomaketyyppi } from '#/src/constants';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { selectToteutusHakulomaketyyppi } from './hooks';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';

type Props = { toteutus?: Toteutus };

export const ToteutusHakutiedot = ({ toteutus }: Props) => {
  const hakulomaketyyppi = selectToteutusHakulomaketyyppi(toteutus);

  switch (true) {
    case hakulomaketyyppi === Hakulomaketyyppi.MUU:
      return <ToteutusHakuMuu toteutus={toteutus} />;
    case hakulomaketyyppi === Hakulomaketyyppi.EI_SAHKOISTA:
      return <ToteutusHakuEiSahkoista toteutus={toteutus} />;
    case !_.isEmpty(toteutus?.hakutiedot):
      return <ToteutusHakukohteet toteutus={toteutus} />;
    default:
      return null;
  }
};
