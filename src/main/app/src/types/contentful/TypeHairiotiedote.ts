import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeHairiotiedoteFields {
    name: EntryFieldTypes.Symbol;
    hairionKuvaus: EntryFieldTypes.Text;
    alertType: EntryFieldTypes.Symbol<"error" | "info" | "success" | "warning">;
    whereShown: EntryFieldTypes.Array<EntryFieldTypes.Symbol<"Oma Opintopolku" | "Opintopolku.fi">>;
    order?: EntryFieldTypes.Integer;
}

export type TypeHairiotiedoteSkeleton = EntrySkeletonType<TypeHairiotiedoteFields, "hairiotiedote">;
export type TypeHairiotiedote<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeHairiotiedoteSkeleton, Modifiers, Locales>;
