import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks';
import { Typography, Box, Container, makeStyles } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import { useTranslation } from 'react-i18next';
import KoulutusInfoGrid from './KoulutusInfoGrid';
import HtmlTextBox from '../common/HtmlTextBox';
import ToteutusList from './ToteutusList';
import HakuKaynnissaCard from './HakuKaynnissaCard';
import { HashLink as Link } from 'react-router-hash-link';
import { colors } from '../../colors';
import Murupolku from '../common/Murupolku';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading,
  selectJarjestajat,
} from '../../store/reducers/koulutusSlice';
import LoadingCircle from '../common/LoadingCircle';
import qs from 'query-string';
import HeroImage from '#/src/components/common/HeroImage';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  lisatietoa: { width: '50%' },
  container: { backgroundColor: colors.white, maxWidth: '1600px' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
  },
}));

const Koulutus = (props) => {
  const history = useHistory();
  const { draft } = qs.parse(history.location.search);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { hakuStore } = useStores();
  const { t } = useTranslation();
  const koulutus = useSelector((state) => selectKoulutus(state, oid), shallowEqual);
  const toteutukset = useSelector((state) => selectJarjestajat(state, oid));
  const loading = useSelector((state) => selectLoading(state));
  useEffect(() => {
    if (!koulutus) {
      dispatch(fetchKoulutusWithRelatedData(oid, draft));
    }
  }, [dispatch, koulutus, oid, draft]);

  const getKuvausHtmlSection = (captionKey, localizableText) => {
    return localizableText
      ? '<h3>' + t(captionKey) + '</h3>' + l.localize(localizableText)
      : '';
  };

  const createKoulutusHtml = () => {
    if (koulutus?.suorittaneenOsaaminen || koulutus?.tyotehtavatJoissaVoiToimia) {
      return (
        getKuvausHtmlSection(
          'koulutus.suorittaneenOsaaminen',
          koulutus?.suorittaneenOsaaminen
        ) +
        getKuvausHtmlSection(
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutus?.tyotehtavatJoissaVoiToimia
        )
      );
    } else {
      return l.localize(koulutus?.kuvaus);
    }
  };

  return loading ? (
    <LoadingCircle />
  ) : (
    <Container className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt={5} ml={9} alignSelf="start">
          <Murupolku
            path={[
              { name: t('koulutus.hakutulos'), link: hakuStore.createHakuUrl },
              { name: l.localize(koulutus?.tutkintoNimi) },
            ]}
          />
        </Box>
        <Box mt={4}>
          {koulutus?.koulutusAla?.map((ala) => (
            <Typography
              key={ala.koodiUri}
              className={classes.alatText}
              variant="h3"
              component="h1">
              {l.localize(ala)}
            </Typography>
          ))}
        </Box>
        <Box mt={1}>
          <Typography variant="h1" component="h2">
            {l.localize(koulutus?.tutkintoNimi)}
          </Typography>
        </Box>
        <Box mt={7.5}>
          <HeroImage imgUrl={koulutus?.teemakuva} />
        </Box>
        <KoulutusInfoGrid
          className={classes.root}
          nimikkeet={koulutus?.tutkintoNimikkeet}
          koulutustyyppi={koulutus?.koulutusTyyppi}
          laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
        />
        {toteutukset?.length > 0 ? (
          <HakuKaynnissaCard
            title={t('koulutus.haku-kaynnissa')}
            text={t('koulutus.katso-jarjestavat')}
            link={
              <Link
                to="#tarjonta"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={t('koulutus.nayta-oppilaitokset')}
          />
        ) : null}

        <HtmlTextBox
          heading={t('koulutus.kuvaus')}
          html={createKoulutusHtml()}
          className={classes.root}
        />
        <Box id="tarjonta">
          <ToteutusList toteutukset={toteutukset} />
        </Box>
      </Box>
    </Container>
  );
};

export default observer(Koulutus);
