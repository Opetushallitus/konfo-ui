import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeCookieModalTextFields {
    heading?: EntryFieldTypes.Symbol;
    expandLinkText?: EntryFieldTypes.Symbol;
    shortContent?: EntryFieldTypes.Text;
    fullContent?: EntryFieldTypes.Text;
    acceptButtonText?: EntryFieldTypes.Symbol;
    settingsButtonText?: EntryFieldTypes.Symbol;
    settingsHeaderText?: EntryFieldTypes.Symbol;
    settingsAcceptStatisticText?: EntryFieldTypes.Symbol;
    settingsAcceptMarketingText?: EntryFieldTypes.Symbol;
    settingsAcceptMandatoryText?: EntryFieldTypes.Symbol;
    settingsButtonCloseText?: EntryFieldTypes.Symbol;
}

export type TypeCookieModalTextSkeleton = EntrySkeletonType<TypeCookieModalTextFields, "cookieModalText">;
export type TypeCookieModalText<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeCookieModalTextSkeleton, Modifiers, Locales>;
