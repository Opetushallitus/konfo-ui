import React from 'react';

import { useTranslation } from 'react-i18next';

import { RAJAIN_TYPES } from '#/src/constants';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { OrganisaatioSuodatin } from './OrganisaatioSuodatin';

export const ToimipisteSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  return (
    <OrganisaatioSuodatin
      {...props}
      rajainId={RAJAIN_TYPES.TOIMIPISTE}
      name={t('haku.toimipiste')}
      labelText={t('haku.etsi-toimipiste')}
    />
  );
};
