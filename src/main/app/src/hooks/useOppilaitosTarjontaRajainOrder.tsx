import { intersection, includes, isEmpty } from 'lodash';

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
import { KOULUTUS_TYYPPI, KORKEAKOULU_KOULUTUSTYYPIT } from '#/src/constants';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainOrderItem } from '#/src/types/SuodatinTypes';

const AMM_ERITYISOPETUS_KOULUTUSTYYPPI = 'koulutustyyppi_4';

export const useOppilaitosTarjontaRajainOrder = ({
  rajainValues,
  rajainOptions,
}: {
  rajainValues: Partial<RajainValues>;
  rajainOptions: Record<string, any>;
}) => {
  const selectedTyypit = (rajainValues.koulutustyyppi ?? []) as Array<string>;

  // Koulutustyypin lukumäärä ei riipu valitusta koulutustyypistä, joten se kertoo, onko oppilaitoksella tämän tyyppistä tarjontaa
  const hasTarjontaa = (koulutustyyppi: string) =>
    (rajainOptions?.koulutustyyppi?.[koulutustyyppi]?.count ?? 0) > 0;

  const showLukioRajaimet =
    includes(selectedTyypit, KOULUTUS_TYYPPI.LUKIOKOULUTUS) ||
    (isEmpty(selectedTyypit) && hasTarjontaa(KOULUTUS_TYYPPI.LUKIOKOULUTUS));

  // Ammatillisen perustutkinnon erityisopetuksena (koulutustyyppi_4) lukumäärä on vaativan tuen koulutusten alla
  const ammErityisopetusCount =
    rajainOptions?.koulutustyyppi?.['vaativan-tuen-koulutukset']?.alakoodit?.[
      AMM_ERITYISOPETUS_KOULUTUSTYYPPI
    ]?.count ?? 0;
  // Pelkän alakoodin valinta ei valitse yläkoodia, joten ammatilliseksi tulkitaan myös amm:n alakoodit
  const ammTyypit = [
    KOULUTUS_TYYPPI.AMM,
    AMM_ERITYISOPETUS_KOULUTUSTYYPPI,
    ...Object.keys(rajainOptions?.koulutustyyppi?.[KOULUTUS_TYYPPI.AMM]?.alakoodit ?? {}),
  ];

  const showOsaamisalaRajain =
    intersection(ammTyypit, selectedTyypit).length > 0 ||
    (isEmpty(selectedTyypit) &&
      (hasTarjontaa(KOULUTUS_TYYPPI.AMM) || ammErityisopetusCount > 0));

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
    showLukioRajaimet && {
      id: 'lukiopainotukset',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiopainotukset',
      },
    },
    showLukioRajaimet && {
      id: 'lukiolinjaterityinenkoulutustehtava',
      Component: LukiolinjatSuodatin,
      props: {
        name: 'lukiolinjat_er',
      },
    },
    showOsaamisalaRajain && {
      id: 'osaamisala',
      Component: AmmOsaamisalatSuodatin,
    },
  ].filter(Boolean) as Array<RajainOrderItem>;
};
