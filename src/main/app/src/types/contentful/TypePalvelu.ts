import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";

export interface TypePalveluFields {
    name?: EntryFieldTypes.Symbol;
    linkki: EntryFieldTypes.EntryLink<TypeSivuSkeleton>;
    color: EntryFieldTypes.Symbol<"polku" | "sininen">;
    image: EntryFieldTypes.AssetLink;
    content?: EntryFieldTypes.Text;
}

export type TypePalveluSkeleton = EntrySkeletonType<TypePalveluFields, "palvelu">;
export type TypePalvelu<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePalveluSkeleton, Modifiers, Locales>;
