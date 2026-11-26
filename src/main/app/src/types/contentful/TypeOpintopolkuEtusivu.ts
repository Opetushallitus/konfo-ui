import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNostoSkeleton } from "./TypeNosto";

export interface TypeOpintopolkuEtusivuFields {
    nimi: EntryFieldTypes.Symbol;
    kuvaDesktop: EntryFieldTypes.AssetLink;
    kuvaMobiili: EntryFieldTypes.AssetLink;
    koulutustietoOtsikko: EntryFieldTypes.Symbol;
    koulutustietoNostot: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    kirjautuneenPalvelutOtsikko: EntryFieldTypes.Symbol;
    kirjautuneenPalvelutNostot: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    muutPalvelutOtsikko: EntryFieldTypes.Symbol;
    muutPalvelutNostot: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
}

export type TypeOpintopolkuEtusivuSkeleton = EntrySkeletonType<TypeOpintopolkuEtusivuFields, "opintopolkuEtusivu">;
export type TypeOpintopolkuEtusivu<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeOpintopolkuEtusivuSkeleton, Modifiers, Locales>;
