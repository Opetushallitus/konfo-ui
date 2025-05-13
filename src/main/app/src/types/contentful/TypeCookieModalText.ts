import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeCookieModalTextFields {
    heading?: EntryFieldTypes.Symbol;
    expandLinkText?: EntryFieldTypes.Symbol;
    collapseLinkText?: EntryFieldTypes.Symbol;
    shortContent?: EntryFieldTypes.Text;
    fullContent?: EntryFieldTypes.Text;
    acceptButtonText?: EntryFieldTypes.Symbol;
    allowAllCookies?: EntryFieldTypes.Symbol;
    allowOnlyMandatoryCookies?: EntryFieldTypes.Symbol;
    allowOnlyNecessaryCookies?: EntryFieldTypes.Symbol;
    saveSettingsText?: EntryFieldTypes.Symbol;
    settingsButtonText?: EntryFieldTypes.Symbol;
    settingsHeaderText?: EntryFieldTypes.Symbol;
    settingsAcceptStatisticText?: EntryFieldTypes.Symbol;
    settingsAcceptMarketingText?: EntryFieldTypes.Symbol;
    settingsAcceptMandatoryText?: EntryFieldTypes.Symbol;
    settingsButtonCloseText?: EntryFieldTypes.Symbol;
    statisticsCheckboxTitleText?: EntryFieldTypes.Symbol;
    statisticsCheckboxContentText?: EntryFieldTypes.Symbol;
    necessaryCheckboxTitleText?: EntryFieldTypes.Symbol;
    necessaryCheckboxContentText?: EntryFieldTypes.Symbol;
    mandatoryCheckboxTitleText?: EntryFieldTypes.Symbol;
    mandatoryCheckboxContentText?: EntryFieldTypes.Symbol;
}

export type TypeCookieModalTextSkeleton = EntrySkeletonType<TypeCookieModalTextFields, "cookieModalText">;
export type TypeCookieModalText<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeCookieModalTextSkeleton, Modifiers, Locales>;
