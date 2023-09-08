import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeHairiotiedoteFields {
    name: EntryFieldTypes.Symbol;
    hairionKuvaus: EntryFieldTypes.Text;
    alertType: EntryFieldTypes.Symbol<"error" | "info" | "success" | "warning">;
}

export type TypeHairiotiedoteSkeleton = EntrySkeletonType<TypeHairiotiedoteFields, "hairiotiedote">;
export type TypeHairiotiedote<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeHairiotiedoteSkeleton, Modifiers, Locales>;
