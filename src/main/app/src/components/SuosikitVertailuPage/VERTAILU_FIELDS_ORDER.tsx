import { TFunction } from 'i18next';

import { MaterialIconVariant } from '#/src/components/common/MaterialIcon';
import { localize } from '#/src/tools/localization';
import { isNonNil } from '#/src/tools/utils';
import { VertailuSuosikki } from '#/src/types/common';

import { isLukio, isAmmatillinen } from './suosikitVertailuUtils';
import { SuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VertailuKielet } from './VertailuKielet';
import { VertailuKoodiLista } from './VertailuKoodiLista';
import { VertailuPistemaara } from './VertailuPistemaara';
import { VertailuValintakokeet } from './VertailuValintakokeet';

export const VERTAILU_FIELDS_ORDER: Array<{
  icon: MaterialIconName;
  iconVariant: MaterialIconVariant;
  fieldId: keyof SuosikitVertailuMask;
  getLabel: (t: TFunction, vertailuSuosikki?: VertailuSuosikki) => string;
  renderValue: (vertailuSuosikki: VertailuSuosikki, t: TFunction) => React.ReactNode;
}> = [
  {
    icon: 'public',
    iconVariant: 'outlined',
    fieldId: 'kayntiosoite',
    getLabel: (t) => t('suosikit-vertailu.kayntiosoite'),
    renderValue: (vertailuSuosikki, t) =>
      localize(vertailuSuosikki.osoite) || t('suosikit-vertailu.ei-maaritelty'),
  },
  {
    icon: 'door_back',
    iconVariant: 'outlined',
    fieldId: 'sisaanpaasyn-alin-pistemaara',
    getLabel: (t, vertailuSuosikki) =>
      t('suosikit-vertailu.sisaanpaasyn-alin-pistemaara', {
        year: vertailuSuosikki?.edellinenHaku?.vuosi,
      }),
    renderValue: (vertailuSuosikki) => (
      <VertailuPistemaara vertailuSuosikki={vertailuSuosikki} />
    ),
  },
  {
    icon: 'people',
    iconVariant: 'outlined',
    fieldId: 'aloituspaikat-ensisijaiset-hakijat',
    getLabel: (t, vertailuSuosikki) =>
      t('suosikit-vertailu.aloituspaikat-ensisijaiset-hakijat', {
        year: vertailuSuosikki?.edellinenHaku?.vuosi,
      }),
    renderValue: (vertailuSuosikki, t) => {
      const aloituspaikat = vertailuSuosikki?.edellinenHaku?.aloituspaikat;
      const ensisijaisestiHakeneet =
        vertailuSuosikki?.edellinenHaku?.ensisijaisestiHakeneet;

      return isNonNil(aloituspaikat) && isNonNil(ensisijaisestiHakeneet)
        ? `${aloituspaikat} / ${ensisijaisestiHakeneet}`
        : t('suosikit-vertailu.ei-maaritelty');
    },
  },
  {
    icon: 'people',
    iconVariant: 'outlined',
    fieldId: 'aloituspaikat',
    getLabel: (t) => t('suosikit-vertailu.aloituspaikat'),
    renderValue: (vertailuSuosikki, t) => {
      const aloituspaikat = vertailuSuosikki?.aloituspaikat;
      return isNonNil(aloituspaikat)
        ? aloituspaikat
        : t('suosikit-vertailu.ei-maaritelty');
    },
  },
  {
    icon: 'people',
    iconVariant: 'outlined',
    fieldId: 'opiskelijoita',
    getLabel: (t) => t('suosikit-vertailu.opiskelijoita'),
    renderValue: (vertailuSuosikki, t) =>
      vertailuSuosikki.opiskelijoita ?? t('suosikit-vertailu.ei-maaritelty'),
  },
  {
    icon: 'school',
    iconVariant: 'outlined',
    fieldId: 'valintakoe',
    getLabel: (t) => t('suosikit-vertailu.koe-tai-lisanaytto'),
    renderValue: (vertailuSuosikki) => (
      <VertailuValintakokeet valintakokeet={vertailuSuosikki.valintakokeet} />
    ),
  },
  {
    icon: 'school',
    iconVariant: 'outlined',
    fieldId: 'kaksoistutkinto',
    getLabel: (t) => t('suosikit-vertailu.voi-suorittaa-kaksoistutkinnon'),
    renderValue: (vertailuSuosikki, t) =>
      vertailuSuosikki.toinenAsteOnkoKaksoistutkinto ? t('kylla') : t('ei'),
  },
  {
    icon: 'verified',
    iconVariant: 'outlined',
    fieldId: 'lukiodiplomit',
    getLabel: (t) => t('suosikit-vertailu.lukiodiplomit'),
    renderValue: (vertailuSuosikki) =>
      isLukio(vertailuSuosikki) ? (
        <VertailuKoodiLista koodit={vertailuSuosikki.lukiodiplomit} />
      ) : undefined,
  },
  {
    icon: 'chat_bubble_outline',
    iconVariant: 'filled',
    fieldId: 'kielivalikoima',
    getLabel: (t) => t('suosikit-vertailu.kielivalikoima'),
    renderValue: (vertailuSuosikki) =>
      isLukio(vertailuSuosikki) ? (
        <VertailuKielet kielivalikoima={vertailuSuosikki.kielivalikoima} />
      ) : undefined,
  },
  {
    icon: 'lightbulb',
    iconVariant: 'outlined',
    fieldId: 'osaamisalat',
    getLabel: (t) => t('suosikit-vertailu.osaamisalat'),
    renderValue: (vertailuSuosikki, t) =>
      isAmmatillinen(vertailuSuosikki) ? (
        <VertailuKoodiLista
          koodit={vertailuSuosikki.osaamisalat}
          emptyText={t('suosikit-vertailu.ei-osaamisaloja')}
        />
      ) : undefined,
  },
  {
    icon: 'sports_soccer',
    iconVariant: 'filled',
    fieldId: 'urheilijan-amm-koulutus',
    getLabel: (t) => t('suosikit-vertailu.jarjestaa-urheilijan-amm-koulutusta'),
    renderValue: (vertailuSuosikki, t) =>
      isAmmatillinen(vertailuSuosikki)
        ? t(vertailuSuosikki.jarjestaaUrheilijanAmmKoulutusta ? 'kylla' : 'ei')
        : undefined,
  },
];
