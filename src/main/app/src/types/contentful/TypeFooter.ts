import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeFooterFields {
    name?: EntryFieldTypes.Symbol<"Footer">;
    content?: EntryFieldTypes.Text;
    contentCenter?: EntryFieldTypes.Text;
    contentRight?: EntryFieldTypes.Text;
    lopputekstit?: EntryFieldTypes.Text;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeFooterSkeleton, Modifiers, Locales>;
