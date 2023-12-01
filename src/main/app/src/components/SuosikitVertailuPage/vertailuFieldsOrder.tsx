import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';

import { MaterialIconVariant } from '#/src/components/common/MaterialIcon';
import { NDASH } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { VertailuSuosikki } from '#/src/types/common';

import { SuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VertailuKielet } from './VertailuKielet';
import { VertailuKoodiLista } from './VertailuKoodiLista';
import { VertailuPistemaara } from './VertailuPistemaara';
import { VertailuValintakokeet } from './VertailuValintakokeet';

export const FIELDS_ORDER: Array<{
  icon: MaterialIconName;
  iconVariant?: MaterialIconVariant;
  fieldId: keyof SuosikitVertailuMask;
  getLabel?: (t: TFunction, vertailuSuosikki?: VertailuSuosikki) => string;
  renderValue?: (vertailuSuosikki: VertailuSuosikki, t: TFunction) => React.ReactNode;
}> = [
  {
    icon: 'public',
    iconVariant: 'outlined',
    fieldId: 'kayntiosoite',
    getLabel: (t) => t('suosikit-vertailu.kayntiosoite'),
    renderValue: (vertailuSuosikki) => localize(vertailuSuosikki.osoite),
  },
  {
    icon: 'door_back',
    iconVariant: 'outlined',
    fieldId: 'sisaanpaasyn-pistemaara',
    getLabel: (t, vertailuSuosikki) =>
      t('suosikit-vertailu.sisaanpaasyn-alin-pistemaara', {
        year: vertailuSuosikki?.edellinenHaku?.vuosi,
      }),
    renderValue: (vertailuSuosikki) =>
      vertailuSuosikki.edellinenHaku && (
        <VertailuPistemaara vertailuSuosikki={vertailuSuosikki} />
      ),
  },
  {
    icon: 'people_outline',
    fieldId: 'opiskelijoita',
    getLabel: (t) => t('suosikit-vertailu.opiskelijoita'),
    renderValue: (vertailuSuosikki) => vertailuSuosikki.opiskelijoita,
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
    getLabel: (t) => t('suosikit-vertailu.kaksoistutkinto'),
    renderValue: (vertailuSuosikki, t) =>
      vertailuSuosikki.toinenAsteOnkoKaksoistutkinto
        ? t?.('suosikit-vertailu.voi-suorittaa-kaksoistutkinnon')
        : NDASH,
  },
  {
    icon: 'verified',
    iconVariant: 'outlined',
    fieldId: 'lukiodiplomit',
    getLabel: (t) => t('suosikit-vertailu.lukiodiplomit'),
    renderValue: (vertailuSuosikki) =>
      vertailuSuosikki.koulutustyyppi !== 'lk' &&
      isEmpty(vertailuSuosikki.lukiodiplomit) ? null : (
        <VertailuKoodiLista koodit={vertailuSuosikki.lukiodiplomit} />
      ),
  },
  {
    icon: 'chat_bubble_outline',
    fieldId: 'kielivalikoima',
    getLabel: (t: TFunction) => t('suosikit-vertailu.kielivalikoima'),
    renderValue: (vertailuSuosikki: VertailuSuosikki) =>
      isEmpty(vertailuSuosikki.kielivalikoima) ? null : (
        <VertailuKielet kielivalikoima={vertailuSuosikki.kielivalikoima} />
      ),
  },
  {
    icon: 'lightbulb',
    iconVariant: 'outlined',
    fieldId: 'osaamisalat',
    getLabel: (t: TFunction) => t('suosikit-vertailu.osaamisalat'),
    renderValue: (vertailuSuosikki: VertailuSuosikki) =>
      isEmpty(vertailuSuosikki.osaamisalat) ? null : (
        <VertailuKoodiLista koodit={vertailuSuosikki.osaamisalat} />
      ),
  },
  {
    icon: 'sports_soccer',
    fieldId: 'urheilijan-amm-koulutus',
    renderValue: (vertailuSuosikki: VertailuSuosikki, t: TFunction) =>
      isEmpty(vertailuSuosikki.jarjestaaUrheilijanAmmKoulutusta)
        ? t('suosikit-vertailu.jarjestaa-urheilijan-amm-koulutusta')
        : null,
  },
];
