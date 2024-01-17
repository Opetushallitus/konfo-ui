import { Grid, Icon, Paper, Typography } from '@mui/material';
import { isString } from 'lodash';

import ApurahaIcon from '#/src/assets/images/Apuraha.svg';
import KoulutuksenLaajuusIcon from '#/src/assets/images/koulutuksen_laajuus.svg';
import KoulutusAsteIcon from '#/src/assets/images/koulutusaste.svg';
import KoulutusTyypitIcon from '#/src/assets/images/koulutustyyppi.svg';
import OpetusKasvatusPsykologiaIcon from '#/src/assets/images/opetus_kasvatus_psykologia.svg';
import SuunniteltuKestoIcon from '#/src/assets/images/suunniteltu_kesto.svg';
import TutkintoNimikeIcon from '#/src/assets/images/tutkintonimike.svg';
import TutkintoonHakeminenIcon from '#/src/assets/images/tutkintoon_hakeminen.svg';
import { educationTypeColorCode } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { styled } from '#/src/theme';
import { toId } from '#/src/tools/utils';

const StyledPaper = styled(Paper)({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  backgroundColor: educationTypeColorCode.ammatillinenGreenBg, // TODO: Not sure if this should come from koulutus type theme
});

const iconLookupTable: Record<string, string> = {
  KoulutusAsteIcon: KoulutusAsteIcon,
  KoulutusTyypitIcon: KoulutusTyypitIcon,
  TutkintoNimikeIcon: TutkintoNimikeIcon,
  SuunniteltuKestoIcon: SuunniteltuKestoIcon,
  KoulutuksenLaajuusIcon: KoulutuksenLaajuusIcon,
  TutkintoonHakeminenIcon: TutkintoonHakeminenIcon,
  OpetusKasvatusPsykologiaIcon: OpetusKasvatusPsykologiaIcon,
  ApurahaIcon: ApurahaIcon,
};

type Props = {
  gridData: Array<{
    id?: string;
    icon: string | React.JSX.Element;
    title: string;
    modalText?: React.JSX.Element | false;
    text: string;
    testid?: string;
  }>;
};

export const InfoGrid = (props: Props) => {
  const { gridData } = props;

  return (
    <StyledPaper>
      <Grid
        sx={(theme) => ({
          padding: 8,
          [theme.breakpoints.down('sm')]: {
            padding: 2,
          },
        })}
        container
        justifyContent="space-evenly"
        spacing={5}>
        {gridData.map((e, index) => (
          <Grid
            item
            container
            spacing={1}
            xs={12}
            md={6}
            lg={4}
            key={`info-grid-${e.id}-${index}`}>
            <Grid item>
              {isString(e.icon) ? (
                <Icon>
                  <img src={iconLookupTable[e.icon]} alt="" />
                </Icon>
              ) : (
                e.icon
              )}
            </Grid>
            <Grid
              item
              xs={10}
              spacing={1}
              alignContent="flex-start"
              container
              direction="column"
              wrap="nowrap">
              <Grid item container spacing={1} wrap="nowrap" alignItems="flex-start">
                <Grid item>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                    variant="body1"
                    id={toId(e.title)}>
                    {e.title}
                  </Typography>
                </Grid>
                {e?.modalText && (
                  <Grid item>
                    <LabelTooltip title={e?.modalText} />
                  </Grid>
                )}
              </Grid>
              <Grid item>
                {e.text.split('\n').map((line, i) => (
                  <Typography
                    component="div"
                    variant="body1"
                    key={i}
                    data-testid={e['testid']}
                    aria-labelledby={toId(e.title)}>
                    {line}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </StyledPaper>
  );
};
