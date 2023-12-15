import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  useSuosikitDataOrdered,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';

import { useSuosikitVertailuData } from './useSuosikitVertailuData';
import { VertailuFieldMask } from './VertailuFieldMask';
import { VertailuKortti } from './VertailuKortti';
import { ContentWrapper } from '../common/ContentWrapper';
import { Murupolku } from '../common/Murupolku';
import { QueryResult } from '../common/QueryResultWrapper';
import { Heading, HeadingBoundary } from '../Heading';

const Vertailu = ({ oids }: { oids: Array<string> }) => {
  const queryResult = useSuosikitVertailuData(oids);
  const { data } = queryResult;

  const orderedData = useSuosikitDataOrdered(data);

  return (
    <QueryResult queryResult={queryResult}>
      <Box display="flex" flexDirection="column" gap={2}>
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
