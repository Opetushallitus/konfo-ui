import { includes } from 'lodash';

import { HakuKaynnissaSuodatin } from '#/src/components/suodattimet/common/HakuKaynnissaSuodatin';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { OppilaitosSuodatin } from '#/src/components/suodattimet/common/OppilaitosSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { AmmOsaamisalatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/AmmOsaamisalatSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { AlkamiskausiSuodatin } from '../suodattimet/common/AlkamiskausiSuodatin';
import { KoulutuksenKestoSuodatin } from '../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../suodattimet/common/OpetusaikaSuodatin';
import { LukiolinjatSuodatin } from '../suodattimet/toteutusSuodattimet/LukiolinjatSuodatin';

export const useToteutusRajainOrder = ({
  koulutustyyppi,
}: {
  koulutustyyppi: string;
}) => {
  return [
    {
      id: 'opetuskieli',
      Component: OpetuskieliSuodatin,
    },
    {
      id: 'opetusaika',
      Component: OpetusaikaSuodatin,
    },
    {
      id: 'sijainti',
      Component: SijaintiSuodatin,
    },
    {
      id: 'pohjakoulutusvaatimus',
      Component: PohjakoulutusvaatimusSuodatin,
    },
    {
      id: 'hakukaynnissa',
      Component: HakuKaynnissaSuodatin, // TODO: Piilossa, jos ei valittu?
    },
    {
      id: 'hakutapa',
      Component: HakutapaSuodatin, // TODO: Piilossa, jos ei valittu?
    },
    includes(KORKEAKOULU_KOULUTUSTYYPIT, koulutustyyppi) && {
      id: 'valintatapa',
      Component: ValintatapaSuodatin,
    },
    koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && {
      id: 'lukiopainotukset',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiopainotukset',
      },
    },
    koulutustyyppi === KOULUTUS_TYYPPI.LUKIOKOULUTUS && {
      id: 'lukiolinjaterityinenkoulutustehtava',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiolinjat_er',
      },
    },
    koulutustyyppi === KOULUTUS_TYYPPI.AMM && {
      id: 'osaamisala',
      Component: AmmOsaamisalatSuodatin,
    },
    {
      id: 'opetustapa',
      Component: OpetustapaSuodatin,
    },
    {
      id: 'oppilaitos',
      Component: OppilaitosSuodatin,
    },
    {
      id: 'koulutuksenkesto',
      Component: KoulutuksenKestoSuodatin,
    },
    {
      id: 'alkamiskausi',
      Component: AlkamiskausiSuodatin,
    },
    {
      id: 'maksullisuus',
      Component: MaksullisuusSuodatin,
    },
  ].filter((x) => x !== false) as Array<{
    id: string;
    Component: (props: RajainComponentProps) => JSX.Element;
    props?: RajainComponentProps;
  }>;
};
