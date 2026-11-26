import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNostoFields {
    otsikko: EntryFieldTypes.Symbol;
    kuva?: EntryFieldTypes.AssetLink;
    ikoni?: EntryFieldTypes.AssetLink;
    teksti?: EntryFieldTypes.Text;
    linkki?: EntryFieldTypes.Symbol;
    julkaisuaika?: EntryFieldTypes.Date;
    tyyppi?: EntryFieldTypes.Symbol;
    asiasanat?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypeNostoSkeleton = EntrySkeletonType<TypeNostoFields, "nosto">;
export type TypeNosto<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNostoSkeleton, Modifiers, Locales>;
