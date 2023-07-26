import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSivuSkeleton } from "./TypeSivu";
import type { TypeSivuKoosteSkeleton } from "./TypeSivuKooste";

export interface TypeUutinenFields {
    name?: EntryFieldTypes.Symbol;
    sivu?: EntryFieldTypes.EntryLink<TypeSivuKoosteSkeleton | TypeSivuSkeleton>;
    image?: EntryFieldTypes.AssetLink;
    content?: EntryFieldTypes.Text;
}

export type TypeUutinenSkeleton = EntrySkeletonType<TypeUutinenFields, "uutinen">;
export type TypeUutinen<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeUutinenSkeleton, Modifiers, Locales>;
