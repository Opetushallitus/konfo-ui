import React from 'react';

import { Link } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getToteutusOsaamisalaKuvaus } from '#/src/api/konfoApi';
import { AccordionWithTitle } from '#/src/components/common/AccordionWithTitle';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { TODOType } from '#/src/types/common';
import { Toteutus } from '#/src/types/ToteutusTypes';

type UseOsaamisalatProps = {
  ePerusteId: string;
  requestParams: { 'koodi-urit': string };
};

export const useOsaamisalaKuvaukset = ({
  ePerusteId,
  requestParams,
}: UseOsaamisalatProps) =>
  useQuery(
    ['getOsaamisalatPageData', { ePerusteId, requestParams }],
    () => getToteutusOsaamisalaKuvaus({ ePerusteId, requestParams }),
    {
      enabled: !_.isNil(ePerusteId) && !_.isEmpty(requestParams),
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

  const { data: osaamisalaKuvaukset = {} as any, isLoading } = useOsaamisalaKuvaukset({
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
    const kuvaus = !_.isEmpty(extendedData?.kuvaus)
      ? localize(extendedData?.kuvaus)
      : `<p>${t('toteutus.osaamisalalle-ei-loytynyt-kuvausta')}</p>`;
    return { ...toa, extendedData, kuvaus };
  });

  switch (true) {
    case isLoading:
      return <LoadingCircle />;
    case _.isEmpty(osaamisalatCombined):
      return null;
    default:
      return (
        <AccordionWithTitle
          titleTranslationKey="koulutus.osaamisalat"
          data={osaamisalatCombined?.map((osaamisala: any) => ({
            title: localize(osaamisala?.koodi),
            content: (
              <>
                {sanitizedHTMLParser(osaamisala?.kuvaus)}
                {!_.isEmpty(osaamisala?.linkki) && !_.isEmpty(osaamisala?.otsikko) && (
                  <Link
                    target="_blank"
                    rel="noopener"
                    href={localize(osaamisala?.linkki)}>
                    {localize(osaamisala?.otsikko)}
                    <OpenInNewIcon fontSize="small" />
                  </Link>
                )}
              </>
            ),
          }))}
        />
      );
  }
};
