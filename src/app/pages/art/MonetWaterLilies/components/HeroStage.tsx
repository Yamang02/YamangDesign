import { ArtworkInfoCard } from './ArtworkInfoCard';
import { PaletteSwatchBar } from './PaletteSwatchBar';
import styles from './HeroStage.module.css';

const IMAGE_URL =
  'https://www.art-prints-on-demand.com/kunst/claude_monet/Seerosen-Gruene-Reflektionen-mittlere-Teil.jpg';

export function HeroStage() {
  return (
    <section className={styles.stage}>
      <img
        src={IMAGE_URL}
        alt="Claude Monet — Water Lilies, 1906"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.panels}>
        <span className={styles.chapterLabel}>Chapter 1 — The Painting</span>
        <ArtworkInfoCard />
        <PaletteSwatchBar />
      </div>
    </section>
  );
}
