import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNostoFields {
    otsikko: EntryFieldTypes.Symbol;
    ikoni?: EntryFieldTypes.AssetLink;
    teksti?: EntryFieldTypes.Text;
    linkki?: EntryFieldTypes.Symbol;
}

export type TypeNostoSkeleton = EntrySkeletonType<TypeNostoFields, "nosto">;
export type TypeNosto<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNostoSkeleton, Modifiers, Locales>;
