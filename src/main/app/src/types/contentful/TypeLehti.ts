import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";

export interface TypeLehtiFields {
    name?: EntryFieldTypes.Symbol;
    icon?: EntryFieldTypes.AssetLink;
    sivu?: EntryFieldTypes.EntryLink<TypeSivuSkeleton>;
}

export type TypeLehtiSkeleton = EntrySkeletonType<TypeLehtiFields, "lehti">;
export type TypeLehti<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLehtiSkeleton, Modifiers, Locales>;
