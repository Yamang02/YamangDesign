import type { PaletteItem } from '../_shared/PaletteSwatchBar';

/** The Starry Night (van Gogh, 1889) — 8 chips for hero + application section */
export const STARRY_NIGHT_PALETTE = [
  { name: 'Midnight Blue', hex: '#0D1B3E', role: 'Primary' as const },
  { name: 'Swirl Cobalt', hex: '#1B3A8C', role: 'Secondary' as const },
  { name: 'Moonlit Gold', hex: '#F5C842', role: 'Accent' as const },
  { name: 'Star Ivory', hex: '#F0E8C8', role: 'Surface' as const },
  { name: 'Cypress Shadow', hex: '#1A2A1A', role: 'Deep' as const },
  { name: 'Horizon Ochre', hex: '#C8A050', role: 'Sub' as const },
  { name: 'Cloud White', hex: '#E8EDF5', role: 'Highlight' as const },
  { name: 'Dusk Violet', hex: '#3D2B6B', role: 'Muted' as const },
] as const;

/** Ch.1 hero swatches — name + hex only */
export const STARRY_NIGHT_SWATCHES: PaletteItem[] = STARRY_NIGHT_PALETTE.map(({ name, hex }) => ({
  name,
  hex,
}));

/** First 6 colors — Canvas stroke rotation (Post-Impressionism impasto) */
export const STARRY_NIGHT_STROKE_HEX = STARRY_NIGHT_PALETTE.slice(0, 6).map((p) => p.hex);
