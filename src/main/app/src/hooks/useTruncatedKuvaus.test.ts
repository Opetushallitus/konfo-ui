import { stripKuvausHTML } from './useTruncatedKuvaus';

describe('stripKuvausHTML', () => {
  test.each([
    [
      '<p>Oppilas osaa</p><ul><li>lukea</li><li>kirjoittaa</li><li>kuunnella</li></ul>',
      'Oppilas osaa lukea',
      33,
    ],
    [
      '<p>Oppilas osaa</p><ul><li>lukea</li><li>kirjoittaa</li><li>puhua.</li></ul>',
      'Oppilas osaa lukea, kirjoittaa, puhua.',
      undefined,
    ],
    [
      '<p><strong>PÄÄOTSIKKO</strong></p><p>Ensimmäinen kappale.</p><p></p><p><strong>Alaotsikko</strong></p><p>Toinen kappale</p>',
      'PÄÄOTSIKKO: Ensimmäinen kappale. Alaotsikko: Toinen kappale',
      undefined,
    ],
    [
      '<h3>PÄÄOTSIKKO</h3><p>Ensimmäinen kappale.</p><p></p><h3>Alaotsikko</h3><p>Toinen kappale</p>',
      'PÄÄOTSIKKO: Ensimmäinen kappale. Alaotsikko: Toinen kappale',
      undefined,
    ],
  ])('stripKuvausHTML should work right', (kuvaus, stripped, limit) => {
    expect(stripKuvausHTML(kuvaus, limit)).toEqual(stripped);
  });
});
