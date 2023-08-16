import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";

export interface TypeKorttiFields {
    name?: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
    color: EntryFieldTypes.Symbol<"haku" | "polku" | "verkko">;
    linkit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeSivuSkeleton>>;
}

export type TypeKorttiSkeleton = EntrySkeletonType<TypeKorttiFields, "kortti">;
export type TypeKortti<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeKorttiSkeleton, Modifiers, Locales>;
