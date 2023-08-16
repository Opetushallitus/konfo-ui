import React from 'react';

import { Link } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getToteutusOsaamisalaKuvaus } from '#/src/api/konfoApi';
import { Accordion } from '#/src/components/common/Accordion';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { TODOType } from '#/src/types/common';
import { Toteutus } from '#/src/types/ToteutusTypes';

type UseOsaamisalatProps = {
  ePerusteId: string;
  requestParams: { 'koodi-urit': string };
};

const useOsaamisalaKuvaukset = ({ ePerusteId, requestParams }: UseOsaamisalatProps) =>
  useQuery(
    ['getOsaamisalatPageData', { ePerusteId, requestParams }],
    () => getToteutusOsaamisalaKuvaus({ ePerusteId, requestParams }),
    {
      enabled: ePerusteId != null && !isEmpty(requestParams),
    }
  );

export const Osaamisalat = ({
  toteutus,
  koulutus,
}: {
  toteutus: Toteutus;
  koulutus: TODOType;
}) => {
  const { t } = useTranslation();

  const osaamisalat = toteutus?.metadata?.osaamisalat;

  const { data: osaamisalaKuvaukset = [] as Array<any>, isLoading } =
    useOsaamisalaKuvaukset({
      ePerusteId: koulutus?.ePerusteId,
      requestParams: {
        'koodi-urit': osaamisalat?.map((oa: any) => oa?.koodi?.koodiUri)?.join(','),
      },
    });
  // NOTE: This must *not* handle alemmanKorkeakoulututkinnonOsaamisalat or ylemmanKorkeakoulututkinnonOsaamisalat
  const osaamisalatCombined = osaamisalat?.map((toa: any) => {
    const extendedData =
      osaamisalaKuvaukset?.find(
        (koa: any) => toa?.koodi?.koodiUri === koa?.osaamisalakoodiUri
      ) || {};
    const kuvaus = isEmpty(extendedData?.kuvaus)
      ? `<p>${t('toteutus.osaamisalalle-ei-loytynyt-kuvausta')}</p>`
      : localize(extendedData?.kuvaus);
    return { ...toa, extendedData, kuvaus };
  });

  switch (true) {
    case isLoading:
      return <LoadingCircle />;
    case isEmpty(osaamisalatCombined):
      return null;
    default:
      return (
        <PageSection heading={t('koulutus.osaamisalat')}>
          <Accordion
            items={osaamisalatCombined?.map((osaamisala: any) => ({
              title: localize(osaamisala?.koodi),
              content: (
                <>
                  {sanitizedHTMLParser(osaamisala?.kuvaus)}
                  {!isEmpty(osaamisala?.linkki) && !isEmpty(osaamisala?.otsikko) && (
                    <Link
                      target="_blank"
                      rel="noopener"
                      href={localize(osaamisala?.linkki)}>
                      {localize(osaamisala?.otsikko)}
                      <MaterialIcon icon="open_in_new" fontSize="small" />
                    </Link>
                  )}
                </>
              ),
            }))}
          />
        </PageSection>
      );
  }
};
