import { ophColors } from '@opetushallitus/oph-design-system';

export const PAPER_LINK_CLASS = 'paper-link';

// Linkkinä toimivien laatikoiden yhteinen tyyli. Sisältö allekkain. Kaikilla laatikoilla sama varjo. Hiiri- ja kohdistustyylit ovat
// laatikossa: otsikko alleviivataan, kun laatikon päällä on hiiri, ja näppäimistön kohdistus
// näytetään koko laatikon ympärillä.
export const LINK_PAPER_SX = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  [`& .${PAPER_LINK_CLASS}`]: {
    color: 'inherit',
    textDecoration: 'none',
    outline: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
    },
  },
  boxShadow: '2px 2px 8px 0px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    boxShadow: '3px 3px 12px 0px rgba(0, 0, 0, 0.25)',
  },
  [`&:hover .${PAPER_LINK_CLASS}, & .${PAPER_LINK_CLASS}:focus-visible`]: {
    textDecoration: 'underline',
  },
  [`&:has(.${PAPER_LINK_CLASS}:focus-visible)`]: {
    outline: `2px solid ${ophColors.black}`,
    outlineOffset: '2px',
  },
} as const;
