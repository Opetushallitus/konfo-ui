import React from 'react';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { styled } from '@mui/material/styles';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { InfoGrid } from '#/src/components/common/InfoGrid';
import { getLanguage, localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { condArray } from '#/src/tools/utils';
import { Koodi } from '#/src/types/common';

const PREFIX = 'OppilaitosinfoGrid';

const classes = {
  koulutusInfoGridIcon: `${PREFIX}-koulutusInfoGridIcon`,
};

const StyledInfoGrid = styled(InfoGrid)(({ theme }) => ({
  [`& .${classes.koulutusInfoGridIcon}`]: {
    color: theme.palette.primary.main,
  },
}));

type Props = {
  opiskelijoita: number;
  kotipaikat: Array<Koodi>;
  opetuskieli: Array<Koodi>;
  koulutusohjelmia: number;
  toimipisteita?: number;
};

export const OppilaitosinfoGrid = ({
  opiskelijoita,
  kotipaikat,
  opetuskieli,
  koulutusohjelmia,
  toimipisteita,
}: Props) => {
  const { t } = useTranslation();

  const paikkakunnat = localizeArrayToCommaSeparated(kotipaikat, { sorted: true });
  const opetuskielet = _fp.compose(
    _fp.join(', '),
    _fp.map(_fp.capitalize),
    _fp.map(`nimi.${getLanguage()}`)
  )(opetuskieli);

  const perustiedotData = [
    {
      icon: <PublicOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.paikkakunta'),
      text: paikkakunnat,
    },
    {
      icon: <PeopleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opiskelojoita'),
      text: _fp.toString(opiskelijoita),
    },
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opetuskielet'),
      text: opetuskielet,
    },
    ...condArray(!_fp.isNil(toimipisteita), {
      icon: <HomeWorkOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.toimipisteita'),
      text: _fp.toString(toimipisteita),
    }),
    {
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.tutkintoon-johtavia-koulutuksia'),
      text: _fp.toString(koulutusohjelmia),
    },
  ];

  return <StyledInfoGrid gridData={perustiedotData} />;
};
