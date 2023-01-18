import {
  KOULUTUS_TYYPPI,
  TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO,
  YHTEISHAKU_KOODI_URI,
} from '#/src/constants';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { showPisteLaskuri } from './PisteLaskuriUtil';

describe('PisteLaskuriUtil', () => {
  const TOTEUTUS = {
    hakutiedot: [
      {
        kohdejoukko: { koodiUri: TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO },
        hakutapa: { koodiUri: YHTEISHAKU_KOODI_URI },
      },
    ],
  } as Toteutus;

  it('shows pistelaskuri for lukio', () => {
    expect(showPisteLaskuri(TOTEUTUS, KOULUTUS_TYYPPI.LUKIOKOULUTUS, false)).toBeTruthy();
  });

  it('shows pistelaskuri for ammatillinen', () => {
    expect(showPisteLaskuri(TOTEUTUS, KOULUTUS_TYYPPI.AMM, false)).toBeTruthy();
  });

  it('does not show pistelaskuri for erityisopetus', () => {
    expect(showPisteLaskuri(TOTEUTUS, KOULUTUS_TYYPPI.AMM, true)).toBeFalsy();
  });

  it('does not show pistelaskuri for other koulutustyyppi', () => {
    expect(showPisteLaskuri(TOTEUTUS, KOULUTUS_TYYPPI.AMKKOULUTUS, false)).toBeFalsy();
  });

  it('does not show pistelaskuri if kohdejoukko not toisen asteen yhteishaku', () => {
    const toteutus = {
      hakutiedot: [
        {
          kohdejoukko: { koodiUri: 'jatkuva_kk' },
          hakutapa: { koodiUri: YHTEISHAKU_KOODI_URI },
        },
      ],
    } as Toteutus;
    expect(showPisteLaskuri(toteutus, KOULUTUS_TYYPPI.LUKIOKOULUTUS, false)).toBeFalsy();
  });

  it('does not show pistelaskuri if hakutapa not yhteishaku', () => {
    const toteutus = {
      hakutiedot: [
        {
          kohdejoukko: { koodiUri: TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO },
          hakutapa: { koodiUri: 'jatkuva' },
        },
      ],
    } as Toteutus;
    expect(showPisteLaskuri(toteutus, KOULUTUS_TYYPPI.LUKIOKOULUTUS, false)).toBeFalsy();
  });
});
