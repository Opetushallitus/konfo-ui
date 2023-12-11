import { Box } from '@mui/material';
import { isEmpty, every, size } from 'lodash';
import { useTranslation } from 'react-i18next';

import { ColoredPaperContent } from '#/src/components/common/ColoredPaperContent';
import { PageSection } from '#/src/components/common/PageSection';
import { styled } from '#/src/theme';
import { localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Kielivalikoima } from '#/src/types/ToteutusTypes';

const Table = styled('table')({
  borderSpacing: 0,
  borderCollapse: 'separate',
});

const cellStyles = {
  textAlign: 'left',
  maxWidth: '150px',
  padding: '8px',
  verticalAlign: 'top',
} as const;

const Td = styled('td')(cellStyles);
const Th = styled('th')(cellStyles);

const KIELIVALIKOIMA_KEYS: Array<keyof Kielivalikoima> = [
  'A1Kielet',
  'A2Kielet',
  'B1Kielet',
  'B2Kielet',
  'B3Kielet',
  'aidinkielet',
  'muutKielet',
];

export const KielivalikoimaBox = ({
  kielivalikoima,
}: {
  kielivalikoima?: Kielivalikoima;
}) => {
  const { t } = useTranslation();

  const hasKielivalikoima = !(isEmpty(kielivalikoima) || every(kielivalikoima, isEmpty));

  return hasKielivalikoima ? (
    <PageSection heading={t('toteutus.kielivalikoima')}>
      <ColoredPaperContent>
        <Box margin={4}>
          <Table>
            <tbody>
              {KIELIVALIKOIMA_KEYS.map(
                (valikoimaKey) =>
                  // _.size() palauttaa nollan myös nil-arvoille
                  size(kielivalikoima?.[valikoimaKey]) !== 0 && (
                    <tr key={valikoimaKey}>
                      <Th>{t(`toteutus.${valikoimaKey}`)}</Th>
                      <Td>
                        {localizeArrayToCommaSeparated(kielivalikoima![valikoimaKey])}
                      </Td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </Box>
      </ColoredPaperContent>
    </PageSection>
  ) : null;
};
