// NOTE: kts. speksi Invision -> Oppija styleguide -> Konfo-UI colors
export const colors = {
  brandGreen: '#3A7A10', // Header, CTA, Links
  darkGreen: '#254905', // Hover states
  lightGreen: '#9CFF5A', // Focus states
  lightGreenBg: '#CCFFCC', // Label BG
  black: '#1D1D1D', // Headings
  darkGrey: '#4C4C4C', // paragraphs + input field text
  lightGrey: '#B2B2B2', // Disabled states
  greyBg: '#F5F7F9', // Desktop BG
  white: '#FFFFFF', // Content area bg, text on dark bg
  red: '#CC3300', // Error states

  // TODO: Should be from specs?
  blue: '#0033CC',
  grey: '#EEEEEE',
};

// NOTE: kts. speksi Invision -> Oppija styleguide -> Konfo-UI colors
export const educationTypeColorCode: Record<string, string> = {
  // ammatillinenGreen
  amm: colors.brandGreen,
  'amm-osaamisala': colors.brandGreen,
  'amm-tutkinnon-osa': colors.brandGreen,
  'amm-muu': colors.brandGreen,
  ammatillinenGreenBg: '#F4FFF4', // Highlight BG color

  // korkeakouluPurple
  kk: '#990066',
  yo: '#990066',
  amk: '#990066',
  korkeakouluBg: '#FFEFF9', // Highlight BG color

  // lukioBlue
  lk: '#0033CC',
  lkBg: '#F2FBFF', // Highlight BG color

  // tuva
  // KTO-1144: "Konfo-UI:n teemaväriä ei ole vielä hyväksytty, joten väri voi olla sama kuin ammatillisella koulutuksella (vihreä)"
  tuva: colors.brandGreen,
  // tuva: '#FF5000', // TODO Tarkistaa pitikö olla oranssi
  // tuvaBg: '#FFEDE5',
  'vapaa-sivistystyo-opistovuosi': '#007373',
  'vapaa-sivistystyo-muu': '#007373',
  'aikuisten-perusopetus': '#007373',
  vapaaSivistystyoBg: '#E5F2F2',
  aikuistenPerusopetusBg: '#E5F2F2',
  // TODO: What should these be?
  ako: '#1976D2', // Water Blue
  muu: '#DE9A06', // yellow Ochre

  // TODO: What are these as types?
  vapaaSivistystyoBrown: '#993300',
  vapaaSivistystyoBrownBg: '#F4EAE5', // Highlight BG color
  kymppiLuokkaCyan: '#007373',
  kymppiLuokkaCyanBg: '#E5F2F2', // Highlight BG color
};

const root = document.documentElement;

root.style.setProperty('--primary-main-color', colors.brandGreen);
