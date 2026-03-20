import { MuseumLabel } from './MuseumLabel';
import { PaletteSwatchBar } from './PaletteSwatchBar';
import styles from './HeroStage.module.css';

const IMAGE_URL =
  'https://www.art-prints-on-demand.com/kunst/claude_monet/Seerosen-Gruene-Reflektionen-mittlere-Teil.jpg';

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
        <MuseumLabel />
        <PaletteSwatchBar />
      </div>
    </section>
  );
}
