import { localizeHref } from './localizeHref';

test.each([
  ['/konfo/fi/asdf', 'fi', '/fi/asdf'],
  ['/konfo/sv/asdf', 'fi', '/sv/asdf'],
  ['konfo/fi/asdf', 'fi', '/fi/asdf'],
  ['konfo/fi/asdf', 'sv', '/fi/asdf'],
  ['asdf/', 'fi', '/fi/asdf/'],
  ['asdf', 'fi', '/fi/asdf'],
  ['/fi/asdf', 'fi', '/fi/asdf'],
  ['fi/asdf', 'fi', '/fi/asdf'],
  ['https://opintopolku.fi/konfo/fi/asdf', 'fi', '/fi/asdf'],
  ['https://www.opintopolku.fi/konfo/fi/asdf?a=1#b', 'fi', '/fi/asdf?a=1#b'],
  ['https://studieinfo.fi/konfo/sv/asdf', 'fi', '/sv/asdf'],
  ['https://studyinfo.fi/konfo', 'en', '/en/'],
  ['https://opintopolku.fi', 'sv', '/fi/'],
  ['https://opintopolku.fi/', 'en', '/fi/'],
  ['https://www.studieinfo.fi/', 'fi', '/sv/'],
  ['https://studyinfo.fi/?a=1', 'fi', '/en/?a=1'],
  ['https://opintopolku.fi/sv/', 'fi', '/sv/'],
  ['https://opintopolku.fi/en', 'fi', '/en/'],
  ['https://opintopolku.fi/asdf', 'fi', 'https://opintopolku.fi/asdf'],
  ['https://opintopolku.fi/fi/asdf', 'fi', 'https://opintopolku.fi/fi/asdf'],
  [
    'https://virkailija.opintopolku.fi/konfo/fi/asdf',
    'fi',
    'https://virkailija.opintopolku.fi/konfo/fi/asdf',
  ],
  [
    'https://oph.fi/fi/asdf?ref=opintopolku.fi/konfo',
    'fi',
    'https://oph.fi/fi/asdf?ref=opintopolku.fi/konfo',
  ],
  ['#asdf', 'fi', '#asdf'],
])('localizeHref', (input: string, lng: string, output: string) => {
  expect(localizeHref(input, lng)).toEqual(output);
});
