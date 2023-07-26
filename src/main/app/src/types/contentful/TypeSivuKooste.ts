import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeSivuKoosteFields {
    name?: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    modules?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
}

export type TypeSivuKoosteSkeleton = EntrySkeletonType<TypeSivuKoosteFields, "sivuKooste">;
export type TypeSivuKooste<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeSivuKoosteSkeleton, Modifiers, Locales>;
