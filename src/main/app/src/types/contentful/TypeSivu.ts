import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeSivuFields {
    name: EntryFieldTypes.Symbol;
    slug?: EntryFieldTypes.Symbol;
    tableOfContents?: EntryFieldTypes.Boolean;
    description?: EntryFieldTypes.Symbol;
    content?: EntryFieldTypes.Text;
    sdgContentCategory?: EntryFieldTypes.Symbol;
    englishPageVersionId?: EntryFieldTypes.Symbol;
}

export type TypeSivuSkeleton = EntrySkeletonType<TypeSivuFields, "sivu">;
export type TypeSivu<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeSivuSkeleton, Modifiers, Locales>;
