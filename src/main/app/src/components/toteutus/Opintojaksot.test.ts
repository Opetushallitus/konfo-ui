import { getOpintojaksoTitle } from '#/src/components/toteutus/Opintojaksot';

describe('getOpintojaksoTitle', () => {
  it("should return only nimi if opintojenlaajuus isn't defined", () => {
    const opintojakso = {
      nimi: { fi: 'Opintojakson nimi' },
      oid: '1.2.246.562.17.00000000000000009999',
      kuvaus: { fi: '<p>Opintojakson kuvaus</p>' },
    };
    expect(getOpintojaksoTitle(opintojakso)).toBe('Opintojakson nimi');
  });

  it('should return nimi and opintojenlaajuus for title', () => {
    const opintojakso = {
      nimi: { fi: 'Opintojakson nimi' },
      oid: '1.2.246.562.17.00000000000000009999',
      kuvaus: { fi: '<p>Opintojakson kuvaus</p>' },
      opintojenLaajuusNumero: 7.0,
      opintojenLaajuusyksikko: {
        koodiUri: 'opintojenlaajuusyksikko_1#1',
        nimi: {
          sv: 'opintojenlaajuusyksikko_1#1 nimi sv',
          fi: 'opintojenlaajuusyksikko_1#1 nimi fi',
        },
      },
    };

    expect(getOpintojaksoTitle(opintojakso)).toBe(
      'Opintojakson nimi, 7 opintojenlaajuusyksikko_1#1 nimi fi'
    );
  });
});
