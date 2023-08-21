import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeInfoYhteishakuFields {
    nimi?: EntryFieldTypes.Symbol;
    otsikko?: EntryFieldTypes.Symbol;
    kuvaus?: EntryFieldTypes.Text;
    tekstiHakulomakkeelle?: EntryFieldTypes.Symbol;
    linkkiHakulomakkeelle?: EntryFieldTypes.Symbol;
    tekstiOhjeisiin?: EntryFieldTypes.Symbol;
    linkkiOhjeisiin?: EntryFieldTypes.Symbol;
    tekstiHakutuloksiin?: EntryFieldTypes.Symbol;
    linkkiHakutuloksiin?: EntryFieldTypes.Symbol;
    color?: EntryFieldTypes.Symbol<"kk" | "toinenaste">;
    order?: EntryFieldTypes.Integer;
}

export type TypeInfoYhteishakuSkeleton = EntrySkeletonType<TypeInfoYhteishakuFields, "infoYhteishaku">;
export type TypeInfoYhteishaku<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeInfoYhteishakuSkeleton, Modifiers, Locales>;
