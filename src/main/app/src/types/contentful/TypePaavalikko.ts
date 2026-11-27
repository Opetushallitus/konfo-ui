import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeValikkoSkeleton } from "./TypeValikko";

export interface TypePaavalikkoFields {
    nimi?: EntryFieldTypes.Symbol;
    valikot: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeValikkoSkeleton>>;
}

export type TypePaavalikkoSkeleton = EntrySkeletonType<TypePaavalikkoFields, "paavalikko">;
export type TypePaavalikko<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePaavalikkoSkeleton, Modifiers, Locales>;
