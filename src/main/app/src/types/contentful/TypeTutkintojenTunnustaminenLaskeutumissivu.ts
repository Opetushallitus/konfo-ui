import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNostoSkeleton } from "./TypeNosto";
import type { TypeUseinKysytytKysymyksetSkeleton } from "./TypeUseinKysytytKysymykset";

export interface TypeTutkintojenTunnustaminenLaskeutumissivuFields {
    nimi: EntryFieldTypes.Symbol;
    kuvaDesktop: EntryFieldTypes.AssetLink;
    kuvaMobiili: EntryFieldTypes.AssetLink;
    paatoksenTarveOtsikko: EntryFieldTypes.Symbol;
    paatoksenTarveNosto?: EntryFieldTypes.EntryLink<TypeNostoSkeleton>;
    paatoksenHakeminenOtsikko: EntryFieldTypes.Symbol;
    paatoksenHakeminenKortit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    useinKysytytKysymyksetOtsikko: EntryFieldTypes.Symbol;
    useinKysytytKysymyksetLista?: EntryFieldTypes.EntryLink<TypeUseinKysytytKysymyksetSkeleton>;
    yhteystiedotOtsikko: EntryFieldTypes.Symbol;
    yhteystiedotSislt?: EntryFieldTypes.Text;
}

export type TypeTutkintojenTunnustaminenLaskeutumissivuSkeleton = EntrySkeletonType<TypeTutkintojenTunnustaminenLaskeutumissivuFields, "tutkintojenTunnustaminenLaskeutumissivu">;
export type TypeTutkintojenTunnustaminenLaskeutumissivu<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTutkintojenTunnustaminenLaskeutumissivuSkeleton, Modifiers, Locales>;
