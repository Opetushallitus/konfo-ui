import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeKorttiSkeleton } from "./TypeKortti";

export interface TypeKortitFields {
    name: EntryFieldTypes.Symbol;
    kortit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeKorttiSkeleton>>;
}

export type TypeKortitSkeleton = EntrySkeletonType<TypeKortitFields, "kortit">;
export type TypeKortit<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeKortitSkeleton, Modifiers, Locales>;
