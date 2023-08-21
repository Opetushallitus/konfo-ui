import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeContentSkeleton } from "./TypeContent";

export interface TypePikalinkitFields {
    name?: EntryFieldTypes.Symbol;
    osiot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeContentSkeleton>>;
}

export type TypePikalinkitSkeleton = EntrySkeletonType<TypePikalinkitFields, "pikalinkit">;
export type TypePikalinkit<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePikalinkitSkeleton, Modifiers, Locales>;
