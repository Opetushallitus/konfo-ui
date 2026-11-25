import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNostoSkeleton } from "./TypeNosto";

export interface TypeTutkintojenTunnustaminenLaskeutumissivuFields {
    nimi: EntryFieldTypes.Symbol;
    kuvaDesktop: EntryFieldTypes.AssetLink;
    kuvaMobiili: EntryFieldTypes.AssetLink;
    paatoksenTarveOtsikko: EntryFieldTypes.Symbol;
    paatoksenTarveNosto?: EntryFieldTypes.EntryLink<TypeNostoSkeleton>;
    paatoksenHakeminenOtsikko: EntryFieldTypes.Symbol;
    paatoksenHakeminenKortit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    useinKysytytKysymyksetOtsikko: EntryFieldTypes.Symbol;
    useinKysytytKysymyksetLista?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
    yhteystiedotOtsikko: EntryFieldTypes.Symbol;
    yhteystiedotSisalto?: EntryFieldTypes.Text;
    videotOtsikko:  EntryFieldTypes.Symbol;
    videot:  EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNostoSkeleton>>;
}

export type TypeTutkintojenTunnustaminenLaskeutumissivuSkeleton = EntrySkeletonType<TypeTutkintojenTunnustaminenLaskeutumissivuFields, "tutkintojenTunnustaminenLaskeutumissivu">;
export type TypeTutkintojenTunnustaminenLaskeutumissivu<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTutkintojenTunnustaminenLaskeutumissivuSkeleton, Modifiers, Locales>;
