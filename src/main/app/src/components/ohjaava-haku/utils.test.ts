import { getChangedRajaimet } from './utils';

describe('getChangedRajaimet', () => {
  test('adds one rajain in selected rajaimet', () => {
    expect(getChangedRajaimet({}, 'opetusaika', 'opetusaikakk_2')).toEqual({
      opetusaika: ['opetusaikakk_2'],
    });
  });

  test('adds new rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetusaika',
        'opetusaikakk_3'
      )
    ).toEqual({ opetusaika: ['opetusaikakk_2', 'opetusaikakk_3'] });
  });

  test('adds rajain value to an existing rajain with empty rajain values array in selected rajaimet', () => {
    expect(
      getChangedRajaimet({ opetusaika: [] }, 'opetusaika', 'opetusaikakk_2')
    ).toEqual({ opetusaika: ['opetusaikakk_2'] });
  });

  test('adds new rajain to selected rajaimet which already has other values', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetustapa',
        'opetuspaikkakk_3'
      )
    ).toEqual({ opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] });
  });

  test('adds rajain value to already selected rajain in selected rajaimet with one other rajain', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] },
        'opetustapa',
        'opetuspaikkakk_1'
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1'],
    });
  });

  test('removes the only rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'] },
        'opetusaika',
        'opetusaikakk_2'
      )
    ).toEqual({ opetusaika: [] });
  });

  test('removes rajain value from rajain with multiple rajain values', () => {
    expect(
      getChangedRajaimet(
        {
          opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
          opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1', 'opetuspaikkakk_5'],
        },
        'opetustapa',
        'opetuspaikkakk_1'
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_5'],
    });
  });
});
