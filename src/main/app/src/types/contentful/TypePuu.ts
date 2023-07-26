import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLehtiSkeleton } from "./TypeLehti";

export interface TypePuuFields {
    name?: EntryFieldTypes.Symbol;
    left?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLehtiSkeleton>>;
    right?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLehtiSkeleton>>;
}

export type TypePuuSkeleton = EntrySkeletonType<TypePuuFields, "puu">;
export type TypePuu<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePuuSkeleton, Modifiers, Locales>;
