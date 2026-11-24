import { createContext } from 'react';

// Sisältöpalstan (tekstialueen) enimmäisleveys px. Sivupohja voi asettaa tämän, jolloin kaikki
// WithSideMargins-alueet (sivun sisältö, palvelut, footer) rajautuvat samaan levyiseen palstaan.
// Oletuksena ei rajausta.
export const ContentMaxWidthContext = createContext<number | undefined>(undefined);
