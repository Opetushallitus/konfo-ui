import {
  KOULUTUS_TYYPPI,
  YHTEISHAKU_KOODI_URI,
  TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO,
} from '#/src/constants';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Toteutus, Hakutieto } from '#/src/types/ToteutusTypes';

export const showPisteLaskuri = (
  toteutus: Toteutus | undefined,
  tyyppi: string | undefined,
  ammatillinenPerustutkintoErityisopetuksena: boolean | undefined
): boolean => {
  return Boolean(
    tyyppi &&
      [KOULUTUS_TYYPPI.AMM.toString(), KOULUTUS_TYYPPI.LUKIOKOULUTUS.toString()].includes(
        tyyppi
      ) &&
      !ammatillinenPerustutkintoErityisopetuksena &&
      toteutus?.hakutiedot?.some(
        (hakutieto: Hakutieto) =>
          hakutieto?.hakutapa?.koodiUri &&
          hakutieto?.hakutapa?.koodiUri.includes(YHTEISHAKU_KOODI_URI) &&
          hakutieto?.kohdejoukko?.koodiUri?.includes(TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO)
      )
  );
};

export const hasPainokertoimia = (hk: Hakukohde) =>
  (hk.hakukohteenLinja?.painotetutArvosanat || []).length > 0;
