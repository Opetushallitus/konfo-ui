import oppilaitos_img from '#/src/assets/images/logo-oppilaitos.png';
import koulutus_img from '#/src/assets/images/Opolkuhts.png';
import { styled } from '#/src/theme';

const StyledKorttiLogo = styled('img', { name: 'KorttiLogo' })<{
  entity: 'koulutus' | 'oppilaitos';
}>(({ theme, entity }) => {
  return {
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      float: 'right',
      maxWidth: '125px',
      maxHeight: '100px',
    },
    ...(entity === 'koulutus'
      ? {
          [theme.breakpoints.up('xs')]: {
            maxWidth: '100%',
            maxHeight: '150px',
          },
          [theme.breakpoints.up('lg')]: {
            float: 'right',
            maxWidth: '100%',
            maxHeight: '150px',
          },
          [theme.breakpoints.up('xl')]: {
            float: 'right',
            maxWidth: '250px',
            maxHeight: '150px',
          },
        }
      : {
          [theme.breakpoints.up('xs')]: {
            maxWidth: theme.spacing(7),
            maxHeight: theme.spacing(7),
          },
          [theme.breakpoints.up('lg')]: {
            float: 'right',
            maxWidth: '150px',
            maxHeight: '120px',
          },
        }),
  };
});

type Props = {
  alt: string;
  image?: string;
};

export const KoulutusKorttiLogo = ({ alt, image }: Props) => (
  <StyledKorttiLogo alt={alt} entity="koulutus" src={image || koulutus_img} />
);

export const OppilaitosKorttiLogo = ({ alt, image }: Props) => (
  <StyledKorttiLogo entity="oppilaitos" alt={alt} src={image || oppilaitos_img} />
);
