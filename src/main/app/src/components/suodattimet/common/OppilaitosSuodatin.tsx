import React from 'react';

import { useTranslation } from 'react-i18next';

import { RAJAIN_TYPES } from '#/src/constants';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { OrganisaatioSuodatin } from './OrganisaatioSuodatin';

export const OppilaitosSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  return (
    <OrganisaatioSuodatin
      {...props}
      rajainId={RAJAIN_TYPES.OPPILAITOS}
      name={t('haku.oppilaitos')}
      selectLabel={t('haku.etsi-oppilaitos')}
      selectPlaceholder={t('haku.etsi-oppilaitos')}
    />
  );
};
