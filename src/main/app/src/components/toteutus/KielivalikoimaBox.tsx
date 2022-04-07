import React from 'react';

import { Box, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { ColoredPaperContent } from '#/src/components/common/ColoredPaperContent';
import { PageSection } from '#/src/components/common/PageSection';
import { localizeArrayToCommaSeparated } from '#/src/tools/localization';
import { Kielivalikoima } from '#/src/types/ToteutusTypes';

export const useStyles = makeStyles({
  table: {
    borderSpacing: 0,
    borderCollapse: 'separate',
  },
  cell: {
    textAlign: 'left',
    maxWidth: '150px',
    padding: '8px',
    verticalAlign: 'top',
  },
});

const kielivalikoimaKeys: Array<keyof Kielivalikoima> = [
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

  const hasKielivalikoima = !(
    _.isEmpty(kielivalikoima) || _.every(kielivalikoima, _.isEmpty)
  );

  const classes = useStyles();

  return hasKielivalikoima ? (
    <PageSection heading={t('toteutus.kielivalikoima')}>
      <ColoredPaperContent>
        <Box margin={4}>
          <table className={classes.table}>
            <tbody>
              {kielivalikoimaKeys.map(
                (valikoimaKey) =>
                  // _.size() palauttaa nollan myös nil-arvoille
                  _.size(kielivalikoima?.[valikoimaKey]) !== 0 && (
                    <tr key={valikoimaKey}>
                      <th className={classes.cell}>{t(`toteutus.${valikoimaKey}`)}</th>
                      <td className={classes.cell}>
                        {localizeArrayToCommaSeparated(kielivalikoima![valikoimaKey])}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </Box>
      </ColoredPaperContent>
    </PageSection>
  ) : null;
};
