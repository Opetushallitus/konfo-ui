import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeInfoFields {
    name: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.Text;
}

export type TypeInfoSkeleton = EntrySkeletonType<TypeInfoFields, "info">;
export type TypeInfo<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeInfoSkeleton, Modifiers, Locales>;
