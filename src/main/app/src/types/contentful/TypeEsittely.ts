import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeValikkoSkeleton } from "./TypeValikko";

export interface TypeEsittelyFields {
    name: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.RichText;
    linkki?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeEsittelySkeleton | TypeValikkoSkeleton>>;
    sivupaneeli?: EntryFieldTypes.EntryLink<TypeEsittelySkeleton>;
}

export type TypeEsittelySkeleton = EntrySkeletonType<TypeEsittelyFields, "esittely">;
export type TypeEsittely<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeEsittelySkeleton, Modifiers, Locales>;
