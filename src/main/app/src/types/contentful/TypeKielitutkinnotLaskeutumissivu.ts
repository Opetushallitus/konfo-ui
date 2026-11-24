import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeFaqSkeleton } from "./TypeFaq";
import type { TypeNostoSkeleton } from "./TypeNosto";

export interface TypeKielitutkinnotLaskeutumissivuFields {
    nimi: EntryFieldTypes.Symbol;
    kuvaDesktop: EntryFieldTypes.AssetLink;
    kuvaMobiili?: EntryFieldTypes.AssetLink;
    ykiTestiinOsallistuminenOtsikko: EntryFieldTypes.Symbol;
    ykiTestiinOsallistuminenNostot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    ykiLisatietoaOtsikko: EntryFieldTypes.Symbol;
    ykiLisatietoaNostot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    useinKysytytKysymyksetOtsikko: EntryFieldTypes.Symbol;
    useinKysytytKysymyksetLista?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFaqSkeleton>>;
    ajankohtaistaOtsikko: EntryFieldTypes.Symbol;
    ajankohtaistaNostot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    julkaisutOtsikko?: EntryFieldTypes.Symbol;
    julkaisutNostot?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    yhteystiedotOtsikko: EntryFieldTypes.Symbol;
    yhteystiedotSisalto?: EntryFieldTypes.Text;
}

export type TypeKielitutkinnotLaskeutumissivuSkeleton = EntrySkeletonType<TypeKielitutkinnotLaskeutumissivuFields, "kielitutkinnotLaskeutumissivu">;
export type TypeKielitutkinnotLaskeutumissivu<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeKielitutkinnotLaskeutumissivuSkeleton, Modifiers, Locales>;
