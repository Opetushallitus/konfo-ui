import { isEmpty } from 'lodash';

import { Hakulomaketyyppi } from '#/src/constants';
import { OppilaitosOsa, Toteutus } from '#/src/types/ToteutusTypes';

import { selectToteutusHakulomaketyyppi } from './hooks';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';

type Props = {
  toteutus?: Toteutus;
  oppilaitosOsat?: Array<OppilaitosOsa>;
};

export const ToteutusHakutiedot = ({ toteutus, oppilaitosOsat }: Props) => {
  const hakulomaketyyppi = selectToteutusHakulomaketyyppi(toteutus);

  switch (true) {
    case hakulomaketyyppi === Hakulomaketyyppi.MUU:
      return <ToteutusHakuMuu toteutus={toteutus} />;
    case hakulomaketyyppi === Hakulomaketyyppi.EI_SAHKOISTA:
      return <ToteutusHakuEiSahkoista toteutus={toteutus} />;
    case !isEmpty(toteutus?.hakutiedot):
      return <ToteutusHakukohteet toteutus={toteutus} oppilaitosOsat={oppilaitosOsat} />;
    default:
      return null;
  }
};
