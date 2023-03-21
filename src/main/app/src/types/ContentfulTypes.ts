import { LanguageCode } from './common';

// TODO: Tyypitysten geenrointi contentfulista tämän avulla: https://www.npmjs.com/package/contentful-typescript-codegen

export type MinimalContentfulItem = {
  id: string;
  name: string;
  type: string;
};

export type ContentfulItem = {
  id: string;
  name: string;
  type: string;
  created: string;
  updated: string;
  slug?: string;
  url?: string;
  sivu?: MinimalContentfulItem;
};

export type ValikkoContentfulItem = ContentfulItem & {
  linkki: Array<MinimalContentfulItem>;
};

export type LehtiContentfulItem = ContentfulItem & {
  sivu: MinimalContentfulItem;
  icon: MinimalContentfulItem & {
    url: string;
  };
};

// TODO: Tarkka tyypitys puuttuu, ei tietoa millaista dataa on
export type Info = Record<
  string,
  {
    id: string;
    linkki?: { id: string };
    content: string;
  }
>;

export type InfoYhteishaku = Record<
  string,
  {
    id: string;
    otsikko: string;
    kuvaus: string;
    nimi: string;
    color: string;
    tekstiHakulomakkeelle?: string;
    linkkiHakulomakkeelle?: string;
    tekstiOhjeisiin?: string;
    linkkiOhjeisiin?: string;
    tekstiHakutuloksiin?: string;
    linkkiHakutuloksiin?: string;
    order?: number;
  }
>;

export type Kortit = Record<
  string,
  ContentfulItem & {
    kortit: Array<MinimalContentfulItem>;
  }
>;

type Image = MinimalContentfulItem & {
  url: string;
  description: string;
};

export type Uutiset = Record<
  string,
  ContentfulItem & {
    slug: string;
    linkit: Array<MinimalContentfulItem>;
  }
>;

export type ContentfulValikko = Record<string, ValikkoContentfulItem>;

export type Palvelu = Record<
  string,
  ContentfulItem & {
    image: Image;
    color: string;
    linkki: MinimalContentfulItem;
    content: string;
  }
>;

type Asset = Record<
  string,
  ContentfulItem & {
    url: string;
    description: string;
    original: string;
    linkki: MinimalContentfulItem;
  }
>;

type Sivu = Record<
  string,
  ContentfulItem & {
    slug: string;
    content: string;
  }
>;

type Uutinen = Record<
  string,
  ContentfulItem & {
    content: string;
    sivu: MinimalContentfulItem;
    image: Image;
    sideContent?: string;
    description?: string;
  }
>;

type Lehti = Record<string, LehtiContentfulItem>;

type CookieModal = Record<
  string,
  ContentfulItem & {
    settingsHeaderText: string;
    shortContent: string;
    settingsAcceptStatisticText: string;
    settingsButtonCloseText: string;
    heading: string;
    fullContent: string;
    acceptButtonText: string;
    expandLinkText: string;
    settingsAcceptMarketingText: string;
    settingsAcceptMandatoryText: string;
    settingsButtonText: string;
  }
>;

export type ContentfulData = {
  valikko: ContentfulValikko;
  info: Info;
  uutiset: Uutiset;
  kortit: Kortit;
  infoYhteishaku: InfoYhteishaku;
  palvelu: Palvelu;
  asset: Asset;
  sivu: Sivu;
  uutinen: Uutinen;
  sivuKooste: Record<string, ContentfulItem>;
  lehti: Lehti;
  ohjeetJaTuki: Record<string, ContentfulItem>;
  palvelut: Record<string, ContentfulItem>;
  footer: Record<string, ContentfulItem>;
  content: Record<string, ContentfulItem & { content: string }>;
  valikot: Record<string, ContentfulItem & { valikot: Array<MinimalContentfulItem> }>;
  cookieModalText: CookieModal;
};

export type ContentfulManifestData = Record<string, Record<LanguageCode, string>>;
