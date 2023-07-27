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
  TypeEsittely,
  TypeFooter,
  TypeInfo,
  TypeInfoGrid,
  TypeInfoYhteishaku,
  TypeKortit,
  TypeKortti,
  TypeLehti,
  TypeOhjeetJaTuki,
  TypePalvelu,
  TypePalvelut,
  TypePuu,
  TypeSivu,
  TypeSivuKooste,
  TypeUutinen,
  TypeUutiset,
  TypeValikko,
  TypeValikot,
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
export type ContentfulEsittely = ContentfulItem<TypeEsittely<Mod, ''>>;
export type ContentfulFooter = ContentfulItem<TypeFooter<Mod, ''>>;
export type ContentfulInfo = ContentfulItem<TypeInfo<Mod, ''>>;
export type ContentfulInfoGrid = ContentfulItem<TypeInfoGrid<Mod, ''>>;
export type ContentfulInfoYhteishaku = ContentfulItem<TypeInfoYhteishaku<Mod, ''>>;
export type ContentfulKortit = ContentfulItem<TypeKortit<Mod, ''>>;
export type ContentfulKortti = ContentfulItem<TypeKortti<Mod, ''>>;
export type ContentfulLehti = ContentfulItem<TypeLehti<Mod, ''>>;
export type ContentfulOhjeetJaTuki = ContentfulItem<TypeOhjeetJaTuki<Mod, ''>>;
export type ContentfulPalvelu = ContentfulItem<TypePalvelu<Mod, ''>>;
export type ContentfulPalvelut = ContentfulItem<TypePalvelut<Mod, ''>>;
export type ContentfulPuu = ContentfulItem<TypePuu<Mod, ''>>;
export type ContentfulSivu = ContentfulItem<TypeSivu<Mod, ''>>;
export type ContentfulSivuKooste = ContentfulItem<TypeSivuKooste<Mod, ''>>;
export type ContentfulUutinen = ContentfulItem<TypeUutinen<Mod, ''>>;
export type ContentfulUutiset = ContentfulItem<TypeUutiset<Mod, ''>>;
export type ContentfulValikko = ContentfulItem<TypeValikko<Mod, ''>>;
export type ContentfulValikot = ContentfulItem<TypeValikot<Mod, ''>>;

export type CfRecord<T> = Record<string, T>;

export type ContentfulData = {
  asset: CfRecord<ContentfulAsset>;
  content: CfRecord<ContentfulContent>;
  cookieModalText: CfRecord<ContentfulCookieModalTex>;
  esittely: CfRecord<ContentfulEsittely>;
  footer: CfRecord<ContentfulFooter>;
  info: CfRecord<ContentfulInfo>;
  infoGrid: CfRecord<ContentfulInfoGrid>;
  infoYhteishaku: CfRecord<ContentfulInfoYhteishaku>;
  kortit: CfRecord<ContentfulKortit>;
  kortti: CfRecord<ContentfulKortti>;
  lehti: CfRecord<ContentfulLehti>;
  ohjeetJaTuki: CfRecord<ContentfulOhjeetJaTuki>;
  palvelu: CfRecord<ContentfulPalvelu>;
  palvelut: CfRecord<ContentfulPalvelut>;
  puu: CfRecord<ContentfulPuu>;
  sivu: CfRecord<ContentfulSivu>;
  sivuKooste: CfRecord<ContentfulSivuKooste>;
  uutinen: CfRecord<ContentfulUutinen>;
  uutiset: CfRecord<ContentfulUutiset>;
  valikko: CfRecord<ContentfulValikko>;
  valikot: CfRecord<ContentfulValikot>;
};

type ContentTypeId = keyof ContentfulData;

export type ContentfulManifestData = Record<
  keyof ContentfulData,
  Record<LanguageCode, string>
>;
