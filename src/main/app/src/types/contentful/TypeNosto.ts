import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLinkkiSkeleton } from "./TypeLinkki";

export interface TypeNostoFields {
    otsikko: EntryFieldTypes.Symbol;
    kuva?: EntryFieldTypes.AssetLink;
    teksti?: EntryFieldTypes.Text;
    linkit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLinkkiSkeleton>>;
    julkaisuaika?: EntryFieldTypes.Date;
    tyyppi?: EntryFieldTypes.Symbol;
    asiasanat?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    color?: EntryFieldTypes.Symbol<"cyan1" | "green2" | "purple1">;
}

export type TypeNostoSkeleton = EntrySkeletonType<TypeNostoFields, "nosto">;
export type TypeNosto<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNostoSkeleton, Modifiers, Locales>;
