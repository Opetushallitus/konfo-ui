import React from 'react';

import { Box, Divider } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { useSearch } from '#/src/components/haku/hakutulosHooks';

import { HAKU_RAJAIMET_ORDER } from './hakutulos/HAKU_RAJAIMET_ORDER';
import { Suodatin } from './Suodatin';

const getRajainProps = ({ id, t }: { id: string; t: TFunction }) =>
  match(id)
    .with('koulutusala', () => ({ header: t('haku.koulutusalat') }))
    .with('koulutuksenkesto', () => ({ header: t('haku.koulutuksenkestokuukausina') }))
    .with('maksullisuus', () => ({ header: t('maksullisuus') }))
    .otherwise(() => ({ header: t(`haku.${id}`) }));

export const HakupalkkiFilters = () => {
  const { t } = useTranslation();
  const { setRajainValues, rajainValues, rajainOptions } = useSearch();

  return (
    <Box display="flex" flexWrap="wrap" padding="10px" justifyContent="center">
      {HAKU_RAJAIMET_ORDER.map(({ id, Component }, index) => {
        const { header } = getRajainProps({ id, t });
        return (
          <React.Fragment key={id}>
            <Suodatin id={id} header={header}>
              <Component
                rajainOptions={rajainOptions}
                rajainValues={rajainValues}
                setRajainValues={setRajainValues}
                expanded={true}
                summaryHidden={true}
              />
            </Suodatin>
            {index < HAKU_RAJAIMET_ORDER.length - 1 ? (
              <Divider orientation="vertical" flexItem />
            ) : null}
          </React.Fragment>
        );
      })}
    </Box>
  );
};
