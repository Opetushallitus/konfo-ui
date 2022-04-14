import { Box } from '@material-ui/core';
import _fp from 'lodash';

import { Hakulomaketyyppi } from '#/src/constants';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { selectToteutusHakulomaketyyppi } from './hooks';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';

type Props = { toteutus?: Toteutus };

export const ToteutusHakutiedot = ({ toteutus }: Props) => {
  const hakulomaketyyppi = selectToteutusHakulomaketyyppi(toteutus);

  let hakutiedot;
  switch (true) {
    case hakulomaketyyppi === Hakulomaketyyppi.MUU:
      hakutiedot = <ToteutusHakuMuu toteutus={toteutus} />;
      break;
    case hakulomaketyyppi === Hakulomaketyyppi.EI_SAHKOISTA:
      hakutiedot = <ToteutusHakuEiSahkoista toteutus={toteutus} />;
      break;
    case !_fp.isEmpty(toteutus?.hakutiedot):
      hakutiedot = <ToteutusHakukohteet toteutus={toteutus} />;
      break;
    default:
      hakutiedot = null;
  }

  return <Box id="haut">{hakutiedot}</Box>;
};
