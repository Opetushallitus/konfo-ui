import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { LINK_PAPER_SX } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import {
  EtusivuSection,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import {
  EtusivuOsio,
  EtusivuNosto,
} from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

export const Nosto = ({ nosto }: { nosto: EtusivuNosto }) => {
  return (
    <Paper
      sx={{
        ...LINK_PAPER_SX,
        color: ophColors.grey900,
        overflow: 'hidden',
        gap: 0,
        '&:hover': {
          '.arrow_icon': {
            color: ophColors.green2,
          },
        },
      }}>
      {nosto.kuvaUrl && (
        <Box
          component="img"
          src={nosto.kuvaUrl}
          alt=""
          sx={{ width: '100%', objectFit: 'cover' }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flexGrow: 1,
          padding: 2,
        }}>
        <PaperHeading
          color={ophColors.green2}
          fontSize="20px"
          fontWeight={400}
          to={nosto.linkit?.[0]?.href}
          otsikko={nosto.otsikko}
        />
        {nosto.teksti && (
          <OphTypography variant="body2" sx={{ color: 'inherit', flexGrow: 1 }}>
            {nosto.teksti}
          </OphTypography>
        )}
        <MaterialIcon
          icon="arrow_forward"
          aria-hidden
          className="arrow_icon"
          sx={{ color: ophColors.grey400, alignSelf: 'flex-start' }}
        />
      </Box>
    </Paper>
  );
};

export const Nostot = ({ osio }: { osio: EtusivuOsio }) => {
  return (
    <>
      {osio.nostot.map((nosto: EtusivuNosto) => {
        return <Nosto nosto={nosto} key={nosto.id} />;
      })}
    </>
  );
};

// Kielitutkintojen laskeutumissivun nosto-osio (esim. YKI-testiin osallistuminen, Lisätietoa YKI:stä):
// laatikoissa kuva ylhäällä (jos nostolla on kuva), sen alla vihreä otsikko, pieni teksti ja nuoli.
// Isoilla näytöillä neljä laatikkoa rinnakkain.
export const KielitutkinnotNostoOsio = ({ osio }: { osio: EtusivuOsio }) => (
  <EtusivuSection osio={osio}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 4,
      }}>
      <Nostot osio={osio} />
    </Box>
  </EtusivuSection>
);
