import { MuseumLabel } from '../../../_shared/MuseumLabel';
import { PaletteSwatchBar } from '../../../_shared/PaletteSwatchBar';
import styles from './HeroStage.module.css';

const IMAGE_URL =
  'https://www.art-prints-on-demand.com/kunst/claude_monet/Seerosen-Gruene-Reflektionen-mittlere-Teil.jpg';

const MONET_PALETTE = [
  { name: 'Deep Green',  hex: '#2D5016' },
  { name: 'Sage',        hex: '#7A9E5F' },
  { name: 'Lavender',    hex: '#9B8BB4' },
  { name: 'Smoke White', hex: '#E8E4D5' },
  { name: 'Teal',        hex: '#3D7A6E' },
  { name: 'Mustard',     hex: '#C4A84F' },
  { name: 'Deep Purple', hex: '#4A3560' },
  { name: 'Water Blue',  hex: '#5B8FA8' },
];

export function HeroStage() {
  return (
    <section className={styles.stage}>
      <img
        src={IMAGE_URL}
        alt="Claude Monet — Water Lilies: Green Reflections, central section, 1914–18"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.panels}>
        <MuseumLabel
          title="Water Lilies: Green Reflections"
          artist="Claude Monet"
          medium="Oil on Canvas"
          year={1914}
        />
        <PaletteSwatchBar palette={MONET_PALETTE} />
      </div>
    </section>
  );
}
