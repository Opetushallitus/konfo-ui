import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeLinkkiFields {
    href?: EntryFieldTypes.Symbol;
    teksti: EntryFieldTypes.Symbol;
    avautuuUuteenIkkunaan?: EntryFieldTypes.Boolean;
    variant?: EntryFieldTypes.Symbol<"contained" | "outlined" | "text">;
    ikoni?: EntryFieldTypes.Symbol;
}

export type TypeLinkkiSkeleton = EntrySkeletonType<TypeLinkkiFields, "linkki">;
export type TypeLinkki<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLinkkiSkeleton, Modifiers, Locales>;
