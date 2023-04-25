import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { styled } from '@mui/material/styles';
import { flow, map, join, toString, capitalize, isEmpty, isEqual } from 'lodash';
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
  tutkintoonJohtavat: number;
  tutkintoonJohtamattomat: number;
  toimipisteita?: number;
};

type Perustieto = {
  icon: JSX.Element;
  title: string;
  text: string;
};

export const OppilaitosinfoGrid = ({
  opiskelijoita,
  kotipaikat,
  opetuskieli,
  tutkintoonJohtavat,
  tutkintoonJohtamattomat,
  toimipisteita,
}: Props) => {
  const { t } = useTranslation();

  const paikkakunnat = localizeArrayToCommaSeparated(kotipaikat, { sorted: true });
  const opetuskielet = flow(
    (k) => map(k, `nimi.${getLanguage()}`),
    (nimet) => map(nimet, capitalize),
    (nimet) => join(nimet, ', ')
  )(opetuskieli);

  const perustiedotData: Array<Perustieto> = [
    {
      icon: <PublicOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.paikkakunta'),
      text: paikkakunnat,
    },
    {
      icon: <PeopleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opiskelojoita'),
      text: toString(opiskelijoita),
    },
    {
      icon: <ChatBubbleOutlineIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.opetuskielet'),
      text: opetuskielet,
    },
    ...condArray(toimipisteita != null, {
      icon: <HomeWorkOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.toimipisteita'),
      text: toString(toimipisteita),
    }),
    {
      icon: <SchoolOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.tutkintoon-johtavia-koulutuksia'),
      text: toString(tutkintoonJohtavat),
    },
    {
      icon: <LocalLibraryOutlinedIcon className={classes.koulutusInfoGridIcon} />,
      title: t('oppilaitos.koulutuksia-jotka-eivat-johda-tutkntoon'),
      text: toString(tutkintoonJohtamattomat),
    },
  ];
  const filteredPerustiedotData = perustiedotData
    .filter((perustieto) => isEmpty(perustieto.text))
    .filter((perustieto) => isEqual(perustieto.text.trim(), '0'));

  return <StyledInfoGrid gridData={filteredPerustiedotData} />;
};
