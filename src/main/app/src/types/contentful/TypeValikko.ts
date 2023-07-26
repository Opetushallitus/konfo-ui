import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";
import type { TypeSivuKoosteSkeleton } from "./TypeSivuKooste";

export interface TypeValikkoFields {
    name?: EntryFieldTypes.Symbol;
    slug?: EntryFieldTypes.Symbol;
    linkki?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeSivuKoosteSkeleton | TypeSivuSkeleton | TypeValikkoSkeleton>>;
}

export type TypeValikkoSkeleton = EntrySkeletonType<TypeValikkoFields, "valikko">;
export type TypeValikko<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeValikkoSkeleton, Modifiers, Locales>;
