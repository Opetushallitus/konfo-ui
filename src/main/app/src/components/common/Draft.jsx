import React from 'react';

import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useUrlParams } from '#/src/tools/useUrlParams';

const PREFIX = 'Draft';

const classes = {
  draft: `${PREFIX}-draft`,
};

const Root = styled('div')({
  display: 'inline-block',
  position: 'fixed',
  top: '10px',
  left: '-35px',
  width: '120px',
  padding: '5px',
  zIndex: '100000',
  fontSize: '12px',
  textAlign: 'center',
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(229, 57, 53)',
  boxShadow: 'rgba(0, 0, 0, 0.176) 0px 6px 12px',
  transform: 'rotate(-45deg)',
});

export const Draft = () => {
  const { t } = useTranslation();
  const { isDraft } = useUrlParams();
  return isDraft ? <Root className={classes.draft}>{t('Esikatselu')}</Root> : null;
};
