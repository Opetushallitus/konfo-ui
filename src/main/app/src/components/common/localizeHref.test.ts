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
  ['https://opintopolku.fi/konfo/fi/asdf', 'fi', 'https://opintopolku.fi/konfo/fi/asdf'],
  ['https://opintopolku.fi/asdf', 'fi', 'https://opintopolku.fi/asdf'],
  ['#asdf', 'fi', '#asdf'],
])('localizeHref', (input: string, lng: string, output: string) => {
  expect(localizeHref(input, lng)).toEqual(output);
});
