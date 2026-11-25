import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeTutkintojenTunnustamisenPalveluopasFields {
    nimi: EntryFieldTypes.Symbol;
    opasJson: EntryFieldTypes.Object;
}

export type TypeTutkintojenTunnustamisenPalveluopasSkeleton = EntrySkeletonType<TypeTutkintojenTunnustamisenPalveluopasFields, "tutkintojenTunnustamisenPalveluopas">;
export type TypeTutkintojenTunnustamisenPalveluopas<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTutkintojenTunnustamisenPalveluopasSkeleton, Modifiers, Locales>;
