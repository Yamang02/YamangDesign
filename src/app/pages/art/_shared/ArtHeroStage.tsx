import { MuseumLabel } from './MuseumLabel';
import { PaletteSwatchBar } from './PaletteSwatchBar';
import type { PaletteItem } from './PaletteSwatchBar';
import styles from './ArtHeroStage.module.css';

interface LabelInfo {
  title: string
  subtitle?: string
  artist: string
  medium: string
  year: number
  yearEnd?: number
}

interface ArtHeroStageProps {
  imageUrl: string
  imageAlt: string
  label: LabelInfo
  palette: PaletteItem[]
  variant?: 'glass' | 'brutal'
}

export function ArtHeroStage({
  imageUrl,
  imageAlt,
  label,
  palette,
  variant = 'glass',
}: ArtHeroStageProps) {
  return (
    <section className={styles.stage}>
      <img src={imageUrl} alt={imageAlt} className={styles.image} />
      {variant === 'glass' && <div className={styles.overlay} />}
      <div className={styles.panels}>
        <MuseumLabel {...label} />
        <PaletteSwatchBar palette={palette} variant={variant} />
      </div>
    </section>
  );
}
