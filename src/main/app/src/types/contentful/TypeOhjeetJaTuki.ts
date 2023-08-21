import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypePalveluSkeleton } from "./TypePalvelu";

export interface TypeOhjeetJaTukiFields {
    name: EntryFieldTypes.Symbol<"Ohjeet ja tuki">;
    linkit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypePalveluSkeleton>>;
}

export type TypeOhjeetJaTukiSkeleton = EntrySkeletonType<TypeOhjeetJaTukiFields, "ohjeetJaTuki">;
export type TypeOhjeetJaTuki<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeOhjeetJaTukiSkeleton, Modifiers, Locales>;
