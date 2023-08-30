import { resolveNewSlug } from './slugUtils';
import { LanguageCode } from '../types/common';

const slugsFiSv = {
  'test-slug': { id: 'abcd1234', language: 'fi' as LanguageCode },
  'test-slug-2': { id: 'abcd1234', language: 'sv' as LanguageCode },
  'test-slug-3': { id: '4321bcda', language: 'sv' as LanguageCode },
};

const slugsFiEn = {
  'test-slug': {
    id: 'abcd1234',
    englishPageVersionId: '4321bcda',
    language: 'fi' as LanguageCode,
  },
  'test-slug-2': { id: 'aaaa1111', language: 'en' as LanguageCode },
  'test-slug-3': { id: '4321bcda', language: 'en' as LanguageCode },
};

describe('slugUtils/resolveNewSlug', () => {
  test.each([
    [slugsFiSv, { id: 'efgh5678', language: 'fi' as LanguageCode }, 'sv', undefined],
    [slugsFiEn, { id: 'aaaa1111', language: 'en' as LanguageCode }, 'fi', undefined],
  ])('translation not found', (slugsToIds, idInfo, lngParam, resultSlug) => {
    expect(resolveNewSlug(slugsToIds, idInfo, lngParam)).toEqual(resultSlug);
  });

  test.each([
    [slugsFiSv, { id: 'abcd1234', language: 'sv' as LanguageCode }, 'fi', 'test-slug'],
    [slugsFiSv, { id: 'abcd1234', language: 'fi' as LanguageCode }, 'sv', 'test-slug-2'],
  ])('fi <-> sv', (slugsToIds, idInfo, lngParam, resultSlug) => {
    expect(resolveNewSlug(slugsToIds, idInfo, lngParam)).toEqual(resultSlug);
  });

  test.each([
    [
      slugsFiEn,
      {
        id: 'abcd1234',
        language: 'fi' as LanguageCode,
        englishPageVersionId: '4321bcda',
      },
      'en',
      'test-slug-3',
    ],
    [slugsFiEn, { id: '4321bcda', language: 'en' as LanguageCode }, 'fi', 'test-slug'],
  ])('fi <-> en', (slugsToIds, idInfo, lngParam, resultSlug) => {
    expect(resolveNewSlug(slugsToIds, idInfo, lngParam)).toEqual(resultSlug);
  });
});
