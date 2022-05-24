import { useQuery } from 'react-query';

import {
  getHakukohde,
  getKoulutus,
  getToteutus,
  getValintaperuste,
} from '#/src/api/konfoApi';
import { useUrlParams } from '#/src/components/hakutulos/useUrlParams';

type PageDataProps = {
  hakukohdeOid: string;
};

export type PageData = {
  valintaperuste: any;
  koulutus: any;
  toteutus: any;
  hakukohde: any;
};

// TODO: Backend should return most of the data using getHakukohde()
// * valintaperuste is fetched separately only for metadata, other data already returns on getHakukohde
// * toteutus is fetched only for koulutusOid, other data already returns on getHakukohde
// * koulutus is fetched only for koulutus nimi
// Refactor this to only use getHakukohde when all data is available from the call
const getValintaperustePageData = async (
  { hakukohdeOid }: PageDataProps,
  isDraft: boolean
) => {
  const hakukohde = await getHakukohde(hakukohdeOid, isDraft);
  const { toteutus: hakukohdeToteutus, valintaperuste: hakukohdeValintaperuste } =
    hakukohde ?? {};
  const valintaperuste =
    hakukohdeValintaperuste?.id &&
    (await getValintaperuste(hakukohdeValintaperuste.id, isDraft));
  const toteutus = await getToteutus(hakukohdeToteutus?.oid, isDraft);
  const koulutus = await getKoulutus(toteutus?.koulutusOid, isDraft);

  return { koulutus, toteutus, hakukohde, valintaperuste };
};

export const useValintaperustePageData = (props: PageDataProps) => {
  const { isDraft } = useUrlParams();
  return useQuery<PageData>(
    ['getValintaperustePageData', props],
    () => getValintaperustePageData(props, isDraft),
    {
      refetchOnWindowFocus: false,
    }
  );
};

type PreviewPageDataProps = {
  valintaperusteId: string;
};

export type PreviewPageData = {
  valintaperuste: any;
};

const getValintaperustePreviewPageData = async (
  { valintaperusteId }: PreviewPageDataProps,
  isDraft: boolean
) => {
  const valintaperuste = await getValintaperuste(valintaperusteId, isDraft);

  return { valintaperuste };
};

export const useValintaperustePreviewPageData = (props: PreviewPageDataProps) => {
  const { isDraft } = useUrlParams();
  return useQuery<PreviewPageData>(
    ['getValintaperustePreviewPageData', props],
    () => getValintaperustePreviewPageData(props, isDraft),
    {
      refetchOnWindowFocus: false,
    }
  );
};
