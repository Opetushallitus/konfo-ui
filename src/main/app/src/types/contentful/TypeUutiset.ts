import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeUutinenSkeleton } from "./TypeUutinen";

export interface TypeUutisetFields {
    name: EntryFieldTypes.Symbol;
    showImage?: EntryFieldTypes.Boolean;
    greenText?: EntryFieldTypes.Boolean;
    slug: EntryFieldTypes.Symbol;
    linkit?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeUutinenSkeleton>>;
}

export type TypeUutisetSkeleton = EntrySkeletonType<TypeUutisetFields, "uutiset">;
export type TypeUutiset<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeUutisetSkeleton, Modifiers, Locales>;
