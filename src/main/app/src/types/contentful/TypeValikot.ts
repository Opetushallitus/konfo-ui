import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";
import type { TypeValikkoSkeleton } from "./TypeValikko";

export interface TypeValikotFields {
    name?: EntryFieldTypes.Symbol<"Päätason valikot">;
    valikot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeSivuSkeleton | TypeValikkoSkeleton>>;
}

export type TypeValikotSkeleton = EntrySkeletonType<TypeValikotFields, "valikot">;
export type TypeValikot<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeValikotSkeleton, Modifiers, Locales>;
