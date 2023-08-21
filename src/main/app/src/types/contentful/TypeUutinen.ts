import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";

export interface TypeUutinenFields {
    name?: EntryFieldTypes.Symbol;
    sivu?: EntryFieldTypes.EntryLink<TypeSivuSkeleton>;
    image?: EntryFieldTypes.AssetLink;
    content?: EntryFieldTypes.Text;
}

export type TypeUutinenSkeleton = EntrySkeletonType<TypeUutinenFields, "uutinen">;
export type TypeUutinen<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeUutinenSkeleton, Modifiers, Locales>;
