import { includes } from 'lodash';

import { AlkamiskausiSuodatin } from '#/src/components/suodattimet/common/AlkamiskausiSuodatin';
import { HakuaikaRajain } from '#/src/components/suodattimet/common/HakuaikaRajain';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { KoulutuksenKestoSuodatin } from '#/src/components/suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '#/src/components/suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '#/src/components/suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { OppilaitosSuodatin } from '#/src/components/suodattimet/common/OppilaitosSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { AmmOsaamisalatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/LukiolinjatSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

export const useToteutusRajainOrder = ({
  koulutustyyppi,
}: {
  koulutustyyppi: string;
}) => {
  return [
    {
      id: 'hakuaika',
      Component: HakuaikaRajain,
    },
    {
      id: 'alkamiskausi',
      Component: AlkamiskausiSuodatin,
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
      id: 'koulutuksenkesto',
      Component: KoulutuksenKestoSuodatin,
    },
    {
      id: 'maksullisuus',
      Component: MaksullisuusSuodatin,
    },
    {
      id: 'opetuskieli',
      Component: OpetuskieliSuodatin,
    },
    {
      id: 'opetustapa',
      Component: OpetustapaSuodatin,
    },
    {
      id: 'pohjakoulutusvaatimus',
      Component: PohjakoulutusvaatimusSuodatin,
    },
    {
      id: 'hakutapa',
      Component: HakutapaSuodatin,
    },
    {
      id: 'oppilaitos',
      Component: OppilaitosSuodatin,
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
  ].filter(Boolean) as Array<{
    id: string;
    Component: (props: RajainComponentProps) => React.JSX.Element;
    props?: RajainComponentProps;
  }>;
};
