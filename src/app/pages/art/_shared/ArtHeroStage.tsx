import { useState } from 'react';
import { MuseumLabel } from './MuseumLabel';
import { PaletteSwatchBar } from './PaletteSwatchBar';
import type { PaletteItem } from './PaletteSwatchBar';
import { ArtImageModal } from './ArtImageModal';
import styles from './ArtHeroStage.module.css';

export interface LabelInfo {
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
  variant?: 'glass' | 'brutal' | 'minimal'
}

export function ArtHeroStage({
  imageUrl,
  imageAlt,
  label,
  palette,
  variant = 'glass',
}: ArtHeroStageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles.stage}>
      <img
        src={imageUrl}
        alt={imageAlt}
        className={styles.image}
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'zoom-in' }}
      />
      {variant === 'glass' && <div className={styles.overlay} />}
      <div className={styles.panels}>
        <MuseumLabel {...label} />
        <PaletteSwatchBar palette={palette} variant={variant} />
      </div>
      {isModalOpen && (
        <ArtImageModal
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
