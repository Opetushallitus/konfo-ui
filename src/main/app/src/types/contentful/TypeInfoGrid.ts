import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeInfoGridFields {
    name?: EntryFieldTypes.Symbol;
    data?: EntryFieldTypes.Object;
}

export type TypeInfoGridSkeleton = EntrySkeletonType<TypeInfoGridFields, "infoGrid">;
export type TypeInfoGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeInfoGridSkeleton, Modifiers, Locales>;
