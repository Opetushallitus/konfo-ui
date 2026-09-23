import { intersection, includes } from 'lodash';

import { AlkamiskausiSuodatin } from '#/src/components/suodattimet/common/AlkamiskausiSuodatin';
import { HakuaikaRajain } from '#/src/components/suodattimet/common/HakuaikaRajain';
import { HakutapaSuodatin } from '#/src/components/suodattimet/common/HakutapaSuodatin';
import { KoulutuksenKestoSuodatin } from '#/src/components/suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '#/src/components/suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '#/src/components/suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/suodattimet/common/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/suodattimet/common/ValintatapaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { AmmOsaamisalatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/AmmOsaamisalatSuodatin';
import { LukiolinjatSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/LukiolinjatSuodatin';
import { VaativanErityisenTuenSuodatin } from '#/src/components/suodattimet/toteutusSuodattimet/VaativanErityisenTuenSuodatin';
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainOrderItem } from '#/src/types/SuodatinTypes';

export const useOppilaitosTarjontaRajainOrder = ({
  rajainValues,
}: {
  rajainValues: Partial<RajainValues>;
}) => {
  const selectedTyypit = (rajainValues.koulutustyyppi ?? []) as Array<string>;

  return [
    {
      id: 'koulutustyyppi',
      Component: KoulutustyyppiSuodatin,
    },
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
    intersection(KORKEAKOULU_KOULUTUSTYYPIT, selectedTyypit).length > 0 && {
      id: 'valintatapa',
      Component: ValintatapaSuodatin,
    },
    includes(selectedTyypit, KOULUTUS_TYYPPI.LUKIOKOULUTUS) && {
      id: 'lukiopainotukset',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiopainotukset',
      },
    },
    includes(selectedTyypit, KOULUTUS_TYYPPI.LUKIOKOULUTUS) && {
      id: 'lukiolinjaterityinenkoulutustehtava',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiolinjat_er',
      },
    },
    includes(selectedTyypit, KOULUTUS_TYYPPI.AMM) && {
      id: 'osaamisala',
      Component: AmmOsaamisalatSuodatin,
    },
    intersection([KOULUTUS_TYYPPI.AMM, KOULUTUS_TYYPPI.TUVA], selectedTyypit).length >
      0 && {
      id: 'vaativan-tuen-koulutukset',
      Component: VaativanErityisenTuenSuodatin,
    },
  ].filter(Boolean) as Array<RajainOrderItem>;
};
