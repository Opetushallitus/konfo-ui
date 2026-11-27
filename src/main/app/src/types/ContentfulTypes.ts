import {
  Asset,
  ChainModifiers,
  Entry,
  EntrySkeletonType,
  EntryFieldTypes,
  LocaleCode,
} from 'contentful';

import { LanguageCode, Translateable } from './common';
import {
  TypeContent,
  TypeCookieModalText,
  TypeFooter,
  TypeInfo,
  TypeInfoYhteishaku,
  TypeKortit,
  TypeKortti,
  TypeOhjeetJaTuki,
  TypePalvelu,
  TypePalvelut,
  TypePikalinkit,
  TypeSivu,
  TypeUutinen,
  TypeUutiset,
  TypeValikko,
  TypePaavalikko,
  TypeHairiotiedote,
  TypeTutkintojenTunnustamisenPalveluopas,
  TypeOpintopolkuEtusivu,
  TypeNosto,
  TypeLinkki,
} from './contentful';

export type CommonContentfulFields = {
  id: string;
  name: string;
  type: string;
  created: string;
  updated: string;
  formatoituUpdated: Translateable;
  formatoituCreated: Translateable;
};

export type GenericContentfulItem = CommonContentfulFields & {
  slug?: string;
  url?: string;
  sivu?: ContentfulEntryLink<TypeSivu<Mod, ''>>;
};

export type ContentfulLink<Type extends string = ContentTypeId> = {
  id: string;
  type: Type;
  name: string;
};

type ContentfulEntryLink<E extends Entry> = ContentfulLink<
  E['sys']['contentType']['sys']['id']
>;

export type ContentfulAsset = CommonContentfulFields & {
  type: 'asset';
  description: string;
  original: string;
  url: string;
};

// JSON-objektit ja totuusarvot tulee stringeinä
type FieldsModVal<T> = T extends EntryFieldTypes.Object['data']
  ? 'string'
  : T extends boolean
    ? 'true' | 'false'
    : T extends Asset
      ? ContentfulAsset
      : T extends Entry
        ? ContentfulEntryLink<T>
        : T extends Array<infer E>
          ? E extends Entry
            ? Array<ContentfulEntryLink<E>>
            : Array<ContentfulLink>
          : T;

type FieldsMod<F extends EntrySkeletonType['fields']> = {
  [P in keyof F]: FieldsModVal<F[P]>;
};

type ContentfulItem<C extends Entry<EntrySkeletonType, ChainModifiers, LocaleCode>> =
  CommonContentfulFields & {
    type: C['sys']['contentType']['sys']['id'];
  } & FieldsMod<C['fields']>;

type Mod = 'WITHOUT_UNRESOLVABLE_LINKS';

export type ContentfulContent = ContentfulItem<TypeContent<Mod, ''>>;
export type ContentfulCookieModalTex = ContentfulItem<TypeCookieModalText<Mod, ''>>;
export type ContentfulFooter = ContentfulItem<TypeFooter<Mod, ''>>;
export type ContentfulInfo = ContentfulItem<TypeInfo<Mod, ''>>;
export type ContentfulInfoYhteishaku = ContentfulItem<TypeInfoYhteishaku<Mod, ''>>;
export type ContentfulKortit = ContentfulItem<TypeKortit<Mod, ''>>;
export type ContentfulKortti = ContentfulItem<TypeKortti<Mod, ''>>;
export type ContentfulOhjeetJaTuki = ContentfulItem<TypeOhjeetJaTuki<Mod, ''>>;
export type ContentfulPalvelu = ContentfulItem<TypePalvelu<Mod, ''>>;
export type ContentfulPalvelut = ContentfulItem<TypePalvelut<Mod, ''>>;
export type ContentfulPikalinkit = ContentfulItem<TypePikalinkit<Mod, ''>>;
export type ContentfulSivu = ContentfulItem<TypeSivu<Mod, ''>>;
export type ContentfulUutinen = ContentfulItem<TypeUutinen<Mod, ''>>;
export type ContentfulUutiset = ContentfulItem<TypeUutiset<Mod, ''>>;
export type ContentfulValikko = ContentfulItem<TypeValikko<Mod, ''>>;
export type ContentfulPaavalikko = ContentfulItem<TypePaavalikko<Mod, ''>>;
export type ContentfulHairiotiedote = ContentfulItem<TypeHairiotiedote<Mod, ''>>;
export type ContentfulTutkintojenTunnustamisenPalveluopas = ContentfulItem<
  TypeTutkintojenTunnustamisenPalveluopas<Mod, ''>
>;
export type ContentfulOpintopolkuEtusivu = ContentfulItem<
  TypeOpintopolkuEtusivu<Mod, ''>
>;
export type ContentfulNosto = ContentfulItem<TypeNosto<Mod, ''>>;
export type ContentfulLinkki = ContentfulItem<TypeLinkki<Mod, ''>>;

export type CfRecord<T> = Record<string, T>;

export type ContentfulData = {
  asset: CfRecord<ContentfulAsset>;
  content: CfRecord<ContentfulContent>;
  cookieModalText: CfRecord<ContentfulCookieModalTex>;
  footer: CfRecord<ContentfulFooter>;
  info: CfRecord<ContentfulInfo>;
  infoYhteishaku: CfRecord<ContentfulInfoYhteishaku>;
  kortit: CfRecord<ContentfulKortit>;
  kortti: CfRecord<ContentfulKortti>;
  ohjeetJaTuki: CfRecord<ContentfulOhjeetJaTuki>;
  palvelu: CfRecord<ContentfulPalvelu>;
  palvelut: CfRecord<ContentfulPalvelut>;
  pikalinkit: CfRecord<ContentfulPikalinkit>;
  sivu: CfRecord<ContentfulSivu>;
  uutinen: CfRecord<ContentfulUutinen>;
  uutiset: CfRecord<ContentfulUutiset>;
  valikko: CfRecord<ContentfulValikko>;
  paavalikko: CfRecord<ContentfulPaavalikko>;
  hairiotiedote: CfRecord<ContentfulHairiotiedote>;
  tutkintojenTunnustamisenPalveluopas: CfRecord<ContentfulTutkintojenTunnustamisenPalveluopas>;
  opintopolkuEtusivu: CfRecord<ContentfulOpintopolkuEtusivu>;
  nosto: CfRecord<ContentfulNosto>;
  linkki: CfRecord<ContentfulLinkki>;
};

type ContentTypeId = keyof ContentfulData;

export type ContentfulManifestData = Record<
  keyof ContentfulData,
  Record<LanguageCode, string>
>;
