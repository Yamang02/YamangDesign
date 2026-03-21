import { MuseumLabel } from '../../_shared/MuseumLabel';
import { PaletteSwatchBar } from '../../_shared/PaletteSwatchBar';
import { MONET_PALETTE } from '../monet-palette';
import styles from './HeroStage.module.css';

const IMAGE_URL = '/art/monet-water-lilies-green-reflections.png';

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
          yearEnd={1918}
        />
        <PaletteSwatchBar palette={MONET_PALETTE} />
      </div>
    </section>
  );
}
