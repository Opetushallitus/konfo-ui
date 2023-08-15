import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeHairiotiedoteFields {
    showAlert: EntryFieldTypes.Boolean;
    alertText: EntryFieldTypes.Symbol;
    alertType: EntryFieldTypes.Symbol<"error" | "info" | "success" | "warning">;
    linkkiLisatietoja?: EntryFieldTypes.Symbol;
}

export type TypeHairiotiedoteSkeleton = EntrySkeletonType<TypeHairiotiedoteFields, "hairiotiedote">;
export type TypeHairiotiedote<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeHairiotiedoteSkeleton, Modifiers, Locales>;
