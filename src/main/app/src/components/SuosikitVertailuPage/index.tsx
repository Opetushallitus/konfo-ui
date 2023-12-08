import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  useSuosikitDataOrdered,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import { VertailuSuosikki } from '#/src/types/common';

import {
  SiirryHakulomakkeelleDialog,
  useDialogState,
} from './SiirryHakulomakkeelleDialog';
import { useSiirryHakulomakkeelleInfo } from './useSiirryHakulomakkeelleInfo';
import { useSuosikitVertailuData } from './useSuosikitVertailuData';
import { VertailuFieldMask } from './VertailuFieldMask';
import { VertailuKortti } from './VertailuKortti';
import { ContentWrapper } from '../common/ContentWrapper';
import { ExternalLinkButton } from '../common/ExternalLinkButton';
import { Murupolku } from '../common/Murupolku';
import { QueryResult } from '../common/QueryResultWrapper';
import { Heading, HeadingBoundary } from '../Heading';

const SiirryHakulomakkeelleButton = ({ data }: { data?: Array<VertailuSuosikki> }) => {
  const { t } = useTranslation();

  const { isValid, count } = useSiirryHakulomakkeelleInfo(data);

  const { setIsOpen } = useDialogState();

  return (
    <ExternalLinkButton
      disabled={!isValid}
      onClick={() => {
        setIsOpen(true);
      }}>
      {t('suosikit-vertailu.siirry-hakulomakkeelle') +
        ' ' +
        t('suosikit-vertailu.valittu-maara', {
          count,
        })}
    </ExternalLinkButton>
  );
};

const Vertailu = ({ oids }: { oids: Array<string> }) => {
  const queryResult = useSuosikitVertailuData(oids);
  const { data } = queryResult;

  const orderedData = useSuosikitDataOrdered(data);

  const { isOpen, setIsOpen } = useDialogState();

  return (
    <QueryResult queryResult={queryResult}>
      <SiirryHakulomakkeelleDialog
        data={data}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <Box display="flex" flexDirection="column" gap={2}>
        <Box alignSelf="flex-end">
          <SiirryHakulomakkeelleButton data={data} />
        </Box>
        <VertailuFieldMask />
        <Box
          display="flex"
          role="list"
          gap={3}
          flexWrap="wrap"
          alignItems="flex-start"
          data-testid="suosikit-vertailu-list">
          {orderedData?.map((hakukohdeSuosikki) => (
            <VertailuKortti
              key={hakukohdeSuosikki.hakukohdeOid}
              vertailuSuosikki={hakukohdeSuosikki}
              data={data}
            />
          ))}
        </Box>
      </Box>
    </QueryResult>
  );
};

export const SuosikitVertailuPage = () => {
  const { t } = useTranslation();
  const vertailuSuosikit = useVertailuSuosikit();

  const vertailuCount = vertailuSuosikit.length;

  return (
    <ContentWrapper>
      <Box width="100%" alignSelf="start">
        <Murupolku
          path={[
            { name: t('suosikit.otsikko'), link: 'suosikit' },
            { name: t('suosikit-vertailu.otsikko') },
          ]}
        />
      </Box>
      <Heading variant="h1">{t('suosikit-vertailu.otsikko')}</Heading>
      <HeadingBoundary>
        {vertailuCount > 0 ? (
          <Vertailu oids={vertailuSuosikit} />
        ) : (
          t('suosikit-vertailu.ei-vertailtavia-suosikkeja')
        )}
      </HeadingBoundary>
    </ContentWrapper>
  );
};
