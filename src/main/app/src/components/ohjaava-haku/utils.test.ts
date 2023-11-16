import { RajainItem } from '#/src/types/SuodatinTypes';

import {
  getChangedRajaimet,
  getChangedKestoInMonths,
  getYearsAndMonthsFromRangeValue,
  combineMaksunMaaraWithMaksullisuustyyppi,
  getRajainOptionsToShow,
  updateRajainValues,
  getIsRajainSelected,
} from './utils';

describe('updateRajainValues', () => {
  test('adds one rajainValue in an empty array', () => {
    expect(updateRajainValues([], 'opetusaikakk_2')).toEqual(['opetusaikakk_2']);
  });
});

describe('getChangedRajaimet', () => {
  test('adds one rajain with two values in selected rajaimet', () => {
    expect(
      getChangedRajaimet({}, 'opetusaika', ['opetusaikakk_2', 'opetusaikakk_3'])
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_3'],
    });
  });

  test('adds new rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet({ opetusaika: ['opetusaikakk_2'] }, 'opetusaika', [
        'opetusaikakk_3',
      ])
    ).toEqual({ opetusaika: ['opetusaikakk_2', 'opetusaikakk_3'] });
  });

  test('adds rajain value to an existing rajain with empty rajain values array in selected rajaimet', () => {
    expect(
      getChangedRajaimet({ opetusaika: [] }, 'opetusaika', ['opetusaikakk_2'])
    ).toEqual({ opetusaika: ['opetusaikakk_2'] });
  });

  test('adds new rajain to selected rajaimet which already has other rajain', () => {
    expect(
      getChangedRajaimet({ opetusaika: ['opetusaikakk_2'] }, 'opetustapa', [
        'opetuspaikkakk_3',
      ])
    ).toEqual({ opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] });
  });

  test('adds rajain value to already selected rajain in selected rajaimet with one other rajain', () => {
    expect(
      getChangedRajaimet(
        { opetusaika: ['opetusaikakk_2'], opetustapa: ['opetuspaikkakk_3'] },
        'opetustapa',
        ['opetuspaikkakk_1']
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1'],
    });
  });

  test('removes the only rajain value to an existing rajain in selected rajaimet', () => {
    expect(
      getChangedRajaimet({ opetusaika: ['opetusaikakk_2'] }, 'opetusaika', [
        'opetusaikakk_2',
      ])
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
        ['opetuspaikkakk_1']
      )
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_5'],
    });
  });

  test('adds one rajain with two values in selected rajaimet', () => {
    expect(
      getChangedRajaimet({}, 'opetusaika', ['opetusaikakk_2', 'opetusaikakk_3'])
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_3'],
    });
  });

  test('adds rajain with two values in selected rajaimet that has same rajain with different values', () => {
    const selectedRajainValues = {
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3'],
    };
    expect(
      getChangedRajaimet(selectedRajainValues, 'opetustapa', [
        'opetuspaikkakk_1',
        'opetuspaikkakk_5',
      ])
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_1', 'opetuspaikkakk_5'],
    });
  });

  test('adds opetusaikakk_5 and removes opetusaikakk_5 from selected opetusaika rajain values', () => {
    const selectedRajainValues = {
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3'],
    };
    expect(
      getChangedRajaimet(selectedRajainValues, 'opetusaika', [
        'opetusaikakk_1',
        'opetusaikakk_5',
      ])
    ).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_5'],
      opetustapa: ['opetuspaikkakk_3'],
    });
  });

  test("doesn't add any rajain values as the array is empty", () => {
    const selectedRajainValues = {
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3'],
    };
    expect(getChangedRajaimet(selectedRajainValues, 'opetusaika', [])).toEqual({
      opetusaika: ['opetusaikakk_2', 'opetusaikakk_1'],
      opetustapa: ['opetuspaikkakk_3'],
    });
  });
});

describe('getIsRajainSelected', () => {
  test("returns false when rajain with one value isn't selected", () => {
    expect(getIsRajainSelected({}, 'opetustapa', ['opetuspaikkakk_3'])).toBe(false);
  });

  test('returns true when rajain with one value is selected', () => {
    expect(
      getIsRajainSelected({ opetustapa: ['opetuspaikkakk_3'] }, 'opetustapa', [
        'opetuspaikkakk_3',
      ])
    ).toBe(true);
  });

  test('returns true when rajain with two values is selected', () => {
    expect(
      getIsRajainSelected(
        { opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_5'] },
        'opetustapa',
        ['opetuspaikkakk_3', 'opetuspaikkakk_5']
      )
    ).toBe(true);
  });

  test('returns true when rajain with one value is selected and it is among all selected rajaimet', () => {
    expect(
      getIsRajainSelected(
        { opetustapa: ['opetuspaikkakk_3', 'opetuspaikkakk_5'] },
        'opetustapa',
        ['opetuspaikkakk_3']
      )
    ).toBe(true);
  });

  test('returns true when rajain option with two values is selected and it is among all selected rajaimet', () => {
    expect(
      getIsRajainSelected(
        {
          opetusaika: ['opetusaikakk_3', 'opetusaikakk_1'],
          opetustapa: [
            'opetuspaikkakk_3',
            'opetuspaikkakk_5',
            'opetuspaikkakk_1',
            'opetuspaikkakk_4',
          ],
        },
        'opetustapa',
        ['opetuspaikkakk_3', 'opetuspaikkakk_1']
      )
    ).toBe(true);
  });

  test('returns false when rajain option with two values is selected and the other one is not among all selected rajaimet', () => {
    expect(
      getIsRajainSelected(
        {
          opetusaika: ['opetusaikakk_3', 'opetusaikakk_1'],
          opetustapa: [
            'opetuspaikkakk_3',
            'opetuspaikkakk_5',
            'opetuspaikkakk_1',
            'opetuspaikkakk_4',
          ],
        },
        'opetustapa',
        ['opetuspaikkakk_6', 'opetuspaikkakk_1']
      )
    ).toBe(false);
  });

  test('returns false when rajain option is undefined', () => {
    expect(
      getIsRajainSelected(
        {
          opetusaika: ['opetusaikakk_3', 'opetusaikakk_1'],
          opetustapa: [
            'opetuspaikkakk_3',
            'opetuspaikkakk_5',
            'opetuspaikkakk_1',
            'opetuspaikkakk_4',
          ],
        },
        'opetustapa',
        undefined
      )
    ).toBe(false);
  });

  test('returns false when rajain id is not in all selected rajain values', () => {
    expect(
      getIsRajainSelected(
        {
          opetusaika: ['opetusaikakk_3', 'opetusaikakk_1'],
        },
        'opetustapa',
        ['opetuspaikkakk_6', 'opetuspaikkakk_1']
      )
    ).toBe(false);
  });
});

describe('getChangedKestoInMonths', () => {
  test('returns 0 when given one empty strings', () => {
    const vuodetAsStr = '';
    expect(getChangedKestoInMonths(vuodetAsStr, '')).toEqual(0);
  });

  test('returns 12 when given "1" year and an empty string for months', () => {
    expect(getChangedKestoInMonths('1', '')).toEqual(12);
  });

  test('returns 15 when given "1" year and "3" months as strings', () => {
    expect(getChangedKestoInMonths('1', '3')).toEqual(15);
  });

  test('returns 0 when given two empty strings for years and months', () => {
    expect(getChangedKestoInMonths('', '')).toEqual(0);
  });

  test('returns 5 when given non-numeric string for years and "5" for months', () => {
    expect(getChangedKestoInMonths('test', '5')).toEqual(5);
  });

  test('returns 29 when given decimal "2.2" for years and decimal "5.6" for months', () => {
    expect(getChangedKestoInMonths('2.2', '5.6')).toEqual(29);
  });

  test('removes spaces from input and returns 35 when given "2 " for years and "1 1" for months', () => {
    expect(getChangedKestoInMonths(' 2', '1 1')).toEqual(35);
  });
});

describe('getYearsAndMonthsFromRangeValues', () => {
  test('returns ["0", "0"] when range value is 0', () => {
    expect(getYearsAndMonthsFromRangeValue(0)).toEqual(['0', '0']);
  });

  test('returns "1" for years and "0" for months when range value is 12', () => {
    expect(getYearsAndMonthsFromRangeValue(12)).toEqual(['1', '0']);
  });

  test('returns "1" for years and "2" for months when range value is 14', () => {
    expect(getYearsAndMonthsFromRangeValue(14)).toEqual(['1', '2']);
  });

  test('returns "0" for years and "2" for months when range value is 2', () => {
    expect(getYearsAndMonthsFromRangeValue(2)).toEqual(['0', '2']);
  });
});

describe('combineMaksunMaaraWithMaksullisuustyyppi', () => {
  test('returns maksuton without maksun määrä', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });

  test('returns maksuton without maksun määrä and maksullinen with maksun määrä', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
      },
      {
        id: 'maksunmaara',
        rajainId: 'maksunmaara',
        count: 2484,
        upperLimit: 21000,
        min: 0,
        max: 0,
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
        linkedRajainItems: [
          {
            id: 'maksunmaara',
            rajainId: 'maksunmaara',
            count: 2484,
            upperLimit: 21000,
            min: 0,
            max: 0,
          },
        ],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });

  test('combines maksullinen with maksunmaara and lukuvuosimaksu with lukuvuosimaksunmaara', () => {
    const rajainItems = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
      },
      {
        id: 'lukuvuosimaksu',
        rajainId: 'maksullisuustyyppi',
        count: 485,
        checked: false,
        alakoodit: [],
        linkedIds: ['lukuvuosimaksunmaara', 'apuraha'],
      },
      {
        id: 'maksunmaara',
        rajainId: 'maksunmaara',
        count: 2484,
        upperLimit: 21000,
        min: 0,
        max: 0,
      },
      {
        id: 'lukuvuosimaksunmaara',
        rajainId: 'lukuvuosimaksunmaara',
        count: 485,
        upperLimit: 18000,
        min: 0,
        max: 0,
      },
      {
        id: 'apuraha',
        rajainId: 'apuraha',
        count: 485,
        checked: false,
      },
    ] as Array<RajainItem>;

    const result = [
      {
        id: 'maksuton',
        rajainId: 'maksullisuustyyppi',
        count: 1867,
        checked: false,
        alakoodit: [],
      },
      {
        id: 'maksullinen',
        rajainId: 'maksullisuustyyppi',
        count: 2484,
        checked: false,
        alakoodit: [],
        linkedIds: ['maksunmaara'],
        linkedRajainItems: [
          {
            id: 'maksunmaara',
            rajainId: 'maksunmaara',
            count: 2484,
            upperLimit: 21000,
            min: 0,
            max: 0,
          },
        ],
      },
      {
        id: 'lukuvuosimaksu',
        rajainId: 'maksullisuustyyppi',
        count: 485,
        checked: false,
        alakoodit: [],
        linkedIds: ['lukuvuosimaksunmaara', 'apuraha'],
        linkedRajainItems: [
          {
            id: 'lukuvuosimaksunmaara',
            rajainId: 'lukuvuosimaksunmaara',
            count: 485,
            upperLimit: 18000,
            min: 0,
            max: 0,
          },
        ],
      },
    ];
    expect(combineMaksunMaaraWithMaksullisuustyyppi(rajainItems)).toEqual(result);
  });
});

describe('getRajainOptionsToShow', () => {
  test('should remove etä- ja monimuoto-opetus from rajain items', () => {
    const rajainItems = [
      {
        id: 'opetuspaikkakk_1',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Lähiopetus',
          sv: 'Närundervisning',
          en: 'Contact teaching',
        },
      },
      {
        id: 'opetuspaikkakk_2',
        rajainId: 'opetustapa',
        nimi: {
          sv: 'Distansundervisning',
          en: 'Distance teaching',
          fi: 'Etäopetus',
        },
      },
      {
        id: 'opetuspaikkakk_3',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Verkko-opetus',
          sv: 'Nätundervisning',
          en: 'Online teaching',
        },
      },
      {
        id: 'opetuspaikkakk_4',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Monimuoto',
          sv: 'Flerform',
          en: 'Blended teaching',
        },
      },
      {
        id: 'opetuspaikkakk_5',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Itsenäinen opiskelu',
          en: 'Independent learning',
          sv: 'Självständiga studier',
        },
      },
    ] as Array<RajainItem>;

    const rajainOptionsToBeRemoved = ['opetuspaikkakk_4', 'opetuspaikkakk_2'];

    const result = [
      {
        id: 'opetuspaikkakk_1',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Lähiopetus',
          sv: 'Närundervisning',
          en: 'Contact teaching',
        },
        rajainValueIds: ['opetuspaikkakk_1'],
      },
      {
        id: 'opetuspaikkakk_3',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Verkko-opetus',
          sv: 'Nätundervisning',
          en: 'Online teaching',
        },
        rajainValueIds: ['opetuspaikkakk_3'],
      },
      {
        id: 'opetuspaikkakk_5',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Itsenäinen opiskelu',
          en: 'Independent learning',
          sv: 'Självständiga studier',
        },
        rajainValueIds: ['opetuspaikkakk_5'],
      },
    ];
    expect(
      getRajainOptionsToShow(rajainItems, rajainOptionsToBeRemoved, undefined)
    ).toEqual(result);
  });

  test('should remove monimuoto-opetus from rajain items and combine etä- ja verkko-opetus under combined etäopetus', () => {
    const rajainItems = [
      {
        id: 'opetuspaikkakk_1',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Lähiopetus',
          sv: 'Närundervisning',
          en: 'Contact teaching',
        },
      },
      {
        id: 'opetuspaikkakk_2',
        rajainId: 'opetustapa',
        nimi: {
          sv: 'Distansundervisning',
          en: 'Distance teaching',
          fi: 'Etäopetus',
        },
      },
      {
        id: 'opetuspaikkakk_3',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Verkko-opetus',
          sv: 'Nätundervisning',
          en: 'Online teaching',
        },
      },
      {
        id: 'opetuspaikkakk_4',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Monimuoto',
          sv: 'Flerform',
          en: 'Blended teaching',
        },
      },
      {
        id: 'opetuspaikkakk_5',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Itsenäinen opiskelu',
          en: 'Independent learning',
          sv: 'Självständiga studier',
        },
      },
    ] as Array<RajainItem>;

    const rajainOptionsToBeRemoved = ['opetuspaikkakk_4'];
    const rajainOptionsToBeCombined = [
      {
        translationKey: 'combined_etaopetus',
        rajainKoodiuris: ['opetuspaikkakk_2', 'opetuspaikkakk_3'],
      },
    ];

    const result = [
      {
        id: 'opetuspaikkakk_1',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Lähiopetus',
          sv: 'Närundervisning',
          en: 'Contact teaching',
        },
        rajainValueIds: ['opetuspaikkakk_1'],
      },
      {
        id: 'opetuspaikkakk_5',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Itsenäinen opiskelu',
          en: 'Independent learning',
          sv: 'Självständiga studier',
        },
        rajainValueIds: ['opetuspaikkakk_5'],
      },
      {
        id: 'combined_etaopetus',
        rajainValueIds: ['opetuspaikkakk_2', 'opetuspaikkakk_3'],
        rajainId: 'opetustapa',
      },
    ];
    expect(
      getRajainOptionsToShow(
        rajainItems,
        rajainOptionsToBeRemoved,
        rajainOptionsToBeCombined
      )
    ).toEqual(result);
  });

  test('should combine lähi-, etä- ja monimuoto-opetus under combined_monimuoto and verkko- ja itsenäinen  opiskelu under combined_etäopiskelu', () => {
    const rajainItems = [
      {
        id: 'opetuspaikkakk_1',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Lähiopetus',
          sv: 'Närundervisning',
          en: 'Contact teaching',
        },
      },
      {
        id: 'opetuspaikkakk_2',
        rajainId: 'opetustapa',
        nimi: {
          sv: 'Distansundervisning',
          en: 'Distance teaching',
          fi: 'Etäopetus',
        },
      },
      {
        id: 'opetuspaikkakk_3',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Verkko-opetus',
          sv: 'Nätundervisning',
          en: 'Online teaching',
        },
      },
      {
        id: 'opetuspaikkakk_4',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Monimuoto',
          sv: 'Flerform',
          en: 'Blended teaching',
        },
      },
      {
        id: 'opetuspaikkakk_5',
        rajainId: 'opetustapa',
        nimi: {
          fi: 'Itsenäinen opiskelu',
          en: 'Independent learning',
          sv: 'Självständiga studier',
        },
      },
    ] as Array<RajainItem>;

    const rajainOptionsToBeCombined = [
      {
        translationKey: 'combined_etaopetus',
        rajainKoodiuris: ['opetuspaikkakk_3', 'opetuspaikkakk_5'],
      },
      {
        translationKey: 'combined_monimuoto',
        rajainKoodiuris: ['opetuspaikkakk_1', 'opetuspaikkakk_2', 'opetuspaikkakk_4'],
      },
    ];

    const result = [
      {
        id: 'combined_etaopetus',
        rajainValueIds: ['opetuspaikkakk_3', 'opetuspaikkakk_5'],
        rajainId: 'opetustapa',
      },
      {
        id: 'combined_monimuoto',
        rajainValueIds: ['opetuspaikkakk_1', 'opetuspaikkakk_2', 'opetuspaikkakk_4'],
        rajainId: 'opetustapa',
      },
    ];

    expect(getRajainOptionsToShow(rajainItems, [], rajainOptionsToBeCombined)).toEqual(
      result
    );
  });

  test('should combine lähi-, etä- ja monimuoto-opetus under combined_monimuoto and verkko- ja itsenäinen  opiskelu under combined_etäopiskelu', () => {
    const rajainItems = [
      {
        id: 'opetusaikakk_3',
        rajainId: 'opetusaika',
        nimi: {
          fi: 'Viikonloppuopetus',
          sv: 'Veckoslutsundervisning',
          en: 'Weekend teaching',
        },
        count: 531,
      },
      {
        id: 'opetusaikakk_4',
        rajainId: 'opetusaika',
        nimi: {
          en: 'Daytime and evening teaching',
          sv: 'Dags- och kvällsundervisning',
          fi: 'Päivä- ja iltaopetus',
        },
        count: 648,
      },
      {
        id: 'opetusaikakk_5',
        rajainId: 'opetusaika',
        nimi: {
          sv: 'Oberoende av tidpunkt',
          en: 'Irrespective of time',
          fi: 'Ajankohdasta riippumaton',
        },
        count: 2067,
      },
      {
        id: 'opetusaikakk_2',
        rajainId: 'opetusaika',
        nimi: {
          fi: 'Iltaopetus',
          sv: 'Kvällsundervisning',
          en: 'Evening teaching',
        },
        count: 861,
      },
      {
        id: 'opetusaikakk_1',
        rajainId: 'opetusaika',
        nimi: {
          sv: 'Dagundervisning',
          en: 'Day time teaching',
          fi: 'Päiväopetus',
        },
        count: 3001,
      },
    ] as Array<RajainItem>;

    const rajainOptionsToBeCombined = [
      {
        translationKey: 'combined_virka-ajan_ulkopuolella',
        rajainKoodiuris: ['opetusaikakk_2', 'opetusaikakk_3'],
      },
    ];

    const result = [
      {
        id: 'opetusaikakk_4',
        rajainId: 'opetusaika',
        nimi: {
          en: 'Daytime and evening teaching',
          sv: 'Dags- och kvällsundervisning',
          fi: 'Päivä- ja iltaopetus',
        },
        rajainValueIds: ['opetusaikakk_4'],
        count: 648,
      },
      {
        id: 'opetusaikakk_5',
        rajainId: 'opetusaika',
        nimi: {
          sv: 'Oberoende av tidpunkt',
          en: 'Irrespective of time',
          fi: 'Ajankohdasta riippumaton',
        },
        rajainValueIds: ['opetusaikakk_5'],
        count: 2067,
      },
      {
        id: 'opetusaikakk_1',
        rajainId: 'opetusaika',
        nimi: {
          sv: 'Dagundervisning',
          en: 'Day time teaching',
          fi: 'Päiväopetus',
        },
        rajainValueIds: ['opetusaikakk_1'],
        count: 3001,
      },
      {
        id: 'combined_virka-ajan_ulkopuolella',
        rajainValueIds: ['opetusaikakk_3', 'opetusaikakk_2'],
        rajainId: 'opetusaika',
      },
    ];

    expect(
      getRajainOptionsToShow(rajainItems, undefined, rajainOptionsToBeCombined)
    ).toEqual(result);
  });
});
