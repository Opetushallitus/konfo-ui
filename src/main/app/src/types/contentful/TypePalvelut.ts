import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypePalveluSkeleton } from "./TypePalvelu";

export interface TypePalvelutFields {
    name: EntryFieldTypes.Symbol;
    linkit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypePalveluSkeleton>>;
}

export type TypePalvelutSkeleton = EntrySkeletonType<TypePalvelutFields, "palvelut">;
export type TypePalvelut<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePalvelutSkeleton, Modifiers, Locales>;
