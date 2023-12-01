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
  ])('stripKuvausHTML should work right', (kuvaus, stripped, limit) => {
    expect(stripKuvausHTML(kuvaus, limit)).toEqual(stripped);
  });
});
