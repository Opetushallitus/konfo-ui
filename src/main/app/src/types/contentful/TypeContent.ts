import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeContentFields {
    name?: EntryFieldTypes.Symbol;
    iconURL?: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.Text;
}

export type TypeContentSkeleton = EntrySkeletonType<TypeContentFields, "content">;
export type TypeContent<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeContentSkeleton, Modifiers, Locales>;
