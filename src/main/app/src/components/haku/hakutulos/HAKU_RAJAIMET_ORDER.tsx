import { AlkamiskausiSuodatin } from '../../suodattimet/common/AlkamiskausiSuodatin';
import { HakuaikaRajain } from '../../suodattimet/common/HakuaikaRajain';
import { HakutapaSuodatin } from '../../suodattimet/common/HakutapaSuodatin';
import { KoulutuksenKestoSuodatin } from '../../suodattimet/common/KoulutuksenKestoSuodatin';
import { MaksullisuusSuodatin } from '../../suodattimet/common/MaksullisuusSuodatin';
import { OpetusaikaSuodatin } from '../../suodattimet/common/OpetusaikaSuodatin';
import { OpetuskieliSuodatin } from '../../suodattimet/common/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '../../suodattimet/common/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '../../suodattimet/common/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '../../suodattimet/common/SijaintiSuodatin';
import { TyoelamaJaTaydennyskoulutuksetSuodatin } from '../../suodattimet/common/TyoelamaJaTaydennyskoulutuksetSuodatin';
import { ValintatapaSuodatin } from '../../suodattimet/common/ValintatapaSuodatin';
import { KoulutusalaSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '../../suodattimet/hakutulosSuodattimet/KoulutustyyppiSuodatin';

export const HAKU_RAJAIMET_ORDER = [
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
    id: 'koulutusala',
    Component: KoulutusalaSuodatin,
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
    id: 'tyoelama-ja-taydennyskoulutukset',
    Component: TyoelamaJaTaydennyskoulutuksetSuodatin,
  },
  {
    id: 'hakutapa',
    Component: HakutapaSuodatin,
  },
  {
    id: 'valintatapa',
    Component: ValintatapaSuodatin,
  },
];
