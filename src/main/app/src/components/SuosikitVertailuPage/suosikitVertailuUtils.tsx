import { VertailuSuosikki } from '#/src/types/common';

export const isLukio = (s: VertailuSuosikki) => s.koulutustyyppi === 'lk';
export const isAmmatillinen = (s: VertailuSuosikki) => s.koulutustyyppi === 'amm';
