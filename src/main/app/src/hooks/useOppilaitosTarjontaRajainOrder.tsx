import { intersection, isEmpty } from 'lodash';

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
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainOrderItem } from '#/src/types/SuodatinTypes';

const AMM_ERITYISOPETUS_KOULUTUSTYYPPI = 'koulutustyyppi_4';

// Koulutustyyppirajaimen korkeakoulutuksen yläkoodit, joiden alla ovat mm. kandi, maisteri ja amk-alempi
const KORKEAKOULU_YLAKOODIT: Array<string> = [
  KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUS_TYYPPI.AMKKOULUTUS,
];

export const useOppilaitosTarjontaRajainOrder = ({
  rajainValues,
  rajainOptions,
}: {
  rajainValues: Partial<RajainValues>;
  rajainOptions: Record<string, any>;
}) => {
  const selectedTyypit = (rajainValues.koulutustyyppi ?? []) as Array<string>;

  const koulutustyyppiOptions = rajainOptions?.koulutustyyppi ?? {};

  // Koulutustyypin lukumäärä ei riipu valitusta koulutustyypistä, joten se kertoo, onko oppilaitoksella tämän tyyppistä tarjontaa
  const hasTarjontaa = (koulutustyyppi: string) =>
    (koulutustyyppiOptions[koulutustyyppi]?.count ?? 0) > 0;

  // Pelkän alakoodin valinta ei valitse yläkoodia, joten yläkoodin lisäksi huomioidaan sen alakoodit
  const withAlakoodit = (koulutustyyppi: string) => [
    koulutustyyppi,
    ...Object.keys(koulutustyyppiOptions[koulutustyyppi]?.alakoodit ?? {}),
  ];

  // Rajain näytetään, jos jokin sen koulutustyypeistä on valittu, tai jos koulutustyyppiä ei ole valittu ja oppilaitoksella on rajaimeen sopivaa tarjontaa
  const showForKoulutustyypit = (
    koulutustyypit: Array<string>,
    hasSopivaaTarjontaa: boolean
  ) =>
    intersection(koulutustyypit, selectedTyypit).length > 0 ||
    (isEmpty(selectedTyypit) && hasSopivaaTarjontaa);

  const showLukioRajaimet = showForKoulutustyypit(
    [KOULUTUS_TYYPPI.LUKIOKOULUTUS],
    hasTarjontaa(KOULUTUS_TYYPPI.LUKIOKOULUTUS)
  );

  // Ammatillisen perustutkinnon erityisopetuksena (koulutustyyppi_4) lukumäärä on vaativan tuen koulutusten alla
  const ammErityisopetusCount =
    koulutustyyppiOptions['vaativan-tuen-koulutukset']?.alakoodit?.[
      AMM_ERITYISOPETUS_KOULUTUSTYYPPI
    ]?.count ?? 0;

  const showOsaamisalaRajain = showForKoulutustyypit(
    [...withAlakoodit(KOULUTUS_TYYPPI.AMM), AMM_ERITYISOPETUS_KOULUTUSTYYPPI],
    hasTarjontaa(KOULUTUS_TYYPPI.AMM) || ammErityisopetusCount > 0
  );

  const showValintatapaRajain = showForKoulutustyypit(
    KORKEAKOULU_YLAKOODIT.flatMap(withAlakoodit),
    KORKEAKOULU_YLAKOODIT.some(hasTarjontaa)
  );

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
    showValintatapaRajain && {
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
