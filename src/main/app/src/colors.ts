// Tyyliopas Figmassa:
// https://www.figma.com/file/7oWvDwZj6X9cGkEVDfoPLf/OPH---Oppija-Design-System-(opintopolku.fi-%2B-muut-julkiset)

export const colors = {
  red: '#CC3300', // Error states
  korkeakouluPurple: '#990066',
  blue: '#0033CC', // lukio blue

  invisible: 'rgba(255,255,255,0)',
  verminal: '#5BCA13',
  sunglow: '#FFCC33',
  kkMagenta: '#990066',
  koepisteetBlue: '#0041DC',
  yhteispisteetPink: '#E60895',

  brandGreen: '#3A7A10', // green700
  green900: '#254905', // Hover states
  green700: '#3A7A10', // Header, CTA, Ammatillinen accent, Links
  green300: '#9CFF5A', // Focus states
  green100: '#CCFFCC', // Label background
  green50: '#F4FFF4', // Highlight background

  grey900: '#1D1D1D', // Headings
  grey700: '#4C4C4C', // Paragraphs, input field text
  grey600: '#767676', // Disabled states
  grey500: '#B2B2B2', // Disabled states
  // grey400: '#CCCCCC', // TBA, Not used yet
  // grey200: '#E6E6E6', // TBA, Not used yet
  grey50: '#F5F7F9', // Desktop background
  white: '#FFFFFF', // Content area bg, text on dark bg

  brightGreenBg: '#64bc46',
  lightGrayishGreenBg: '#e3ecdd', // Ohjaava haku
  darkerGrayishGreenBg: '#a5c291', // Ohjaava haku hover
};

// NOTE: kts. speksi Invision -> Oppija styleguide -> Konfo-UI colors
export const educationTypeColorCode: Record<string, string> = {
  // ammatillinenGreen
  amm: colors.green700,
  'amm-osaamisala': colors.green700,
  'amm-tutkinnon-osa': colors.green700,
  'amm-muu': colors.green700,
  ammatillinenGreenBg: '#F4FFF4', // Highlight BG color

  // korkeakouluPurple
  kk: colors.korkeakouluPurple,
  yo: colors.korkeakouluPurple,
  amk: colors.korkeakouluPurple,
  'kk-opintojakso': colors.korkeakouluPurple,
  'kk-opintokokonaisuus': colors.korkeakouluPurple,
  korkeakouluBg: '#FFEFF9', // Highlight BG color

  // lukioBlue
  lk: '#0033CC',
  lkBg: '#F2FBFF', // Highlight BG color

  // tuva
  // KTO-1144: "Konfo-UI:n teemaväriä ei ole vielä hyväksytty, joten väri voi olla sama kuin ammatillisella koulutuksella (vihreä)"
  tuva: colors.green700,
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

root.style.setProperty('--primary-main-color', colors.green700);
