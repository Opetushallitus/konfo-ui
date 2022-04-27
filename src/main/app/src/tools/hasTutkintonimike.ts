import { Koulutustyyppi, TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT } from '../constants';

export const hasTutkintonimike = (tyyppi?: Koulutustyyppi) =>
  !TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT.includes(tyyppi as Koulutustyyppi);
