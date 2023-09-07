import React from 'react';

import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const PREFIX = 'Paluu';

const classes = {
  arrow: `${PREFIX}-arrow`,
  link: `${PREFIX}-link`,
};

const Root = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  [`& .${classes.arrow}`]: {
    display: 'inline-flex',
    fontSize: '12px',
  },
});

type Props = {
  paluuLinkki: string;
};

export const Paluu = ({ paluuLinkki }: Props) => {
  const { t } = useTranslation();
  return (
    <Root className={classes.link}>
      <Link
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        href={paluuLinkki}>
        <MaterialIcon icon="arrow_back_ios" className={classes.arrow} />
        {t('lomake.palaa-esittelyyn')}
      </Link>
    </Root>
  );
};
