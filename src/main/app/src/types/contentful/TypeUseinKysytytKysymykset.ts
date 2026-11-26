import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeFaqSkeleton } from "./TypeFaq";

export interface TypeUseinKysytytKysymyksetFields {
    title: EntryFieldTypes.Symbol;
    faqs?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFaqSkeleton>>;
}

export type TypeUseinKysytytKysymyksetSkeleton = EntrySkeletonType<TypeUseinKysytytKysymyksetFields, "useinKysytytKysymykset">;
export type TypeUseinKysytytKysymykset<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeUseinKysytytKysymyksetSkeleton, Modifiers, Locales>;
