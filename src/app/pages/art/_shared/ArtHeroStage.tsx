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
  /** e.g. `48% 38%` — crop bias for composition (Starry Night moon / swirl) */
  imageObjectPosition?: string
  /** LCP: 히어로 원화에 `high` 권장 */
  imageFetchPriority?: 'high' | 'low' | 'auto'
  imageLoading?: 'eager' | 'lazy'
  imageDecoding?: 'async' | 'sync' | 'auto'
}

export function ArtHeroStage({
  imageUrl,
  imageAlt,
  label,
  palette,
  variant = 'glass',
  imageObjectPosition,
  imageFetchPriority,
  imageLoading = 'eager',
  imageDecoding = 'async',
}: Readonly<ArtHeroStageProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles.stage}>
      <button
        type="button"
        className={styles.imageTrigger}
        onClick={() => setIsModalOpen(true)}
        aria-label={`${imageAlt} 크게 보기`}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className={styles.image}
          style={imageObjectPosition ? { objectPosition: imageObjectPosition } : undefined}
          decoding={imageDecoding}
          loading={imageLoading}
          fetchPriority={imageFetchPriority}
        />
      </button>
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
