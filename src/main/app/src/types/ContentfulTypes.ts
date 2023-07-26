import { Asset, ChainModifiers, Entry, EntrySkeletonType, LocaleCode } from 'contentful';

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
  sivu?: EntryLinkki<TypeSivu<Mod, ''>>;
};

type EntryLinkki<E extends Entry> = {
  id: string;
  type: E['sys']['contentType']['sys']['id'];
  name: string;
};

export type ContentfulAsset = CommonContentfulFields & {
  type: 'asset';
  description: string;
  original: string;
  url: string;
};

type FieldsModItem<T> = T extends Asset
  ? ContentfulAsset
  : T extends Entry
  ? EntryLinkki<T>
  : T extends Array<infer E>
  ? E extends Entry
    ? Array<EntryLinkki<E>>
    : T
  : T;

type FieldsMod<F extends EntrySkeletonType['fields']> = {
  [P in keyof F]: FieldsModItem<F[P]>;
};

export type ContentfulItemG<
  C extends Entry<EntrySkeletonType, ChainModifiers, LocaleCode>,
> = CommonContentfulFields & {
  type: C['sys']['contentType']['sys']['id'];
} & FieldsMod<C['fields']>;

type Mod = 'WITHOUT_UNRESOLVABLE_LINKS';
export type ContentfulContent = ContentfulItemG<TypeContent<Mod, ''>>;
export type ContentfulCookieModalTex = ContentfulItemG<TypeCookieModalText<Mod, ''>>;
export type ContentfulEsittely = ContentfulItemG<TypeEsittely<Mod, ''>>;
export type ContentfulFooter = ContentfulItemG<TypeFooter<Mod, ''>>;
export type ContentfulInfo = ContentfulItemG<TypeInfo<Mod, ''>>;
export type ContentfulInfoGrid = ContentfulItemG<TypeInfoGrid<Mod, ''>>;
export type ContentfulInfoYhteishaku = ContentfulItemG<TypeInfoYhteishaku<Mod, ''>>;
export type ContentfulKortit = ContentfulItemG<TypeKortit<Mod, ''>>;
export type ContentfulKortti = ContentfulItemG<TypeKortti<Mod, ''>>;
export type ContentfulLehti = ContentfulItemG<TypeLehti<Mod, ''>>;
export type ContentfulOhjeetJaTuki = ContentfulItemG<TypeOhjeetJaTuki<Mod, ''>>;
export type ContentfulPalvelu = ContentfulItemG<TypePalvelu<Mod, ''>>;
export type ContentfulPalvelut = ContentfulItemG<TypePalvelut<Mod, ''>>;
export type ContentfulPuu = ContentfulItemG<TypePuu<Mod, ''>>;
export type ContentfulSivu = ContentfulItemG<TypeSivu<Mod, ''>>;
export type ContentfulSivuKooste = ContentfulItemG<TypeSivuKooste<Mod, ''>>;
export type ContentfulUutinen = ContentfulItemG<TypeUutinen<Mod, ''>>;
export type ContentfulUutiset = ContentfulItemG<TypeUutiset<Mod, ''>>;
export type ContentfulValikko = ContentfulItemG<TypeValikko<Mod, ''>>;
export type ContentfulValikot = ContentfulItemG<TypeValikot<Mod, ''>>;

export type CfRecord<T> = Record<string, T>;

export type ContentfulData = {
  asset: CfRecord<ContentfulAsset>;
  content: CfRecord<ContentfulContent>;
  cookieModalText: CfRecord<ContentfulCookieModalTex>;
  esittely: CfRecord<ContentfulEsittely>;
  footer: CfRecord<ContentfulFooter>;
  info: CfRecord<ContentfulInfo>;
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

export type ContentfulManifestData = Record<
  keyof ContentfulData,
  Record<LanguageCode, string>
>;
