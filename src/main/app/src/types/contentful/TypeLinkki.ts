import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeLinkkiFields {
    href?: EntryFieldTypes.Symbol;
    teksti: EntryFieldTypes.Symbol;
}

export type TypeLinkkiSkeleton = EntrySkeletonType<TypeLinkkiFields, "linkki">;
export type TypeLinkki<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLinkkiSkeleton, Modifiers, Locales>;
