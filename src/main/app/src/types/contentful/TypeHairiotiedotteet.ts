import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeHairiotiedoteSkeleton } from "./TypeHairiotiedote";

export interface TypeHairiotiedotteetFields {
    name: EntryFieldTypes.Symbol;
    viestit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeHairiotiedoteSkeleton>>;
}

export type TypeHairiotiedotteetSkeleton = EntrySkeletonType<TypeHairiotiedotteetFields, "hairiotiedotteet">;
export type TypeHairiotiedotteet<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeHairiotiedotteetSkeleton, Modifiers, Locales>;
