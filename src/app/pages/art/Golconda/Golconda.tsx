/**
 * E28: Art Reference Gallery — Golconda, René Magritte (1953)
 * Ch.1 원화 · Ch.2 Pretext + Canvas 인상 · Ch.3 팔레트 × DS 적용
 */
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { ArtHeroStage } from '../_shared/ArtHeroStage';
import type { LabelInfo } from '../_shared/ArtHeroStage';
import { ArtApplicationSection } from '../_shared/ArtApplicationSection';
import type { ArtPaletteItem, ArtButtonItem, ArtTypographyItem, ArtCardMeta } from '../_shared/ArtApplicationSection';
import { GOLCONDA_PALETTE } from './golconda-palette';
import { GolcondaImpression } from './components/GolcondaImpression';
import styles from './Golconda.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

const IMAGE_URL = '/art/Golconda.jpg';

const GOLCONDA_PALETTE_ITEMS: ArtPaletteItem[] = [
  { name: 'Sky Wash', hex: '#B8C9D4', role: 'Primary' },
  { name: 'Cloud White', hex: '#EEF2F5', role: 'Surface' },
  { name: 'Deep Sky', hex: '#6B8FA8', role: 'Secondary' },
  { name: 'Suit Black', hex: '#252528', role: 'Dark' },
  { name: 'Skin Warm', hex: '#D4A574', role: 'Accent' },
  { name: 'Roof Gray', hex: '#8A9098', role: 'Neutral' },
  { name: 'Distant Blue', hex: '#9BB5C8', role: 'Highlight' },
  { name: 'Shadow Blue', hex: '#4A5A68', role: 'Muted' },
];

const GOLCONDA_BUTTONS: ArtButtonItem[] = [
  { label: 'Primary', hex: '#6B8FA8', textHex: '#EEF2F5' },
  { label: 'Secondary', hex: '#252528', textHex: '#EEF2F5' },
  { label: 'Accent', hex: '#D4A574', textHex: '#252528' },
  { label: 'Ghost', hex: 'transparent', textHex: '#4A5A68' },
];

const GOLCONDA_TYPOGRAPHY: ArtTypographyItem[] = [
  { level: 'Display', text: 'Golconda', hex: '#6B8FA8' },
  { level: 'Body', text: 'The visible conceals another visibility.', hex: '#252528' },
  { level: 'Caption', text: 'René Magritte, 1953', hex: '#8A9098' },
];

const GOLCONDA_ART_CARD: ArtCardMeta = {
  imageUrl: IMAGE_URL,
  title: 'Golconda',
  artist: 'René Magritte',
  year: 1953,
  movement: 'Surrealism',
  styleTag: 'Glassmorphism',
};

const GOLCONDA_LABEL: LabelInfo = {
  title: 'Golconda',
  artist: 'René Magritte',
  medium: 'Oil on canvas',
  year: 1953,
};

export function Golconda() {
  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS}>
        <div id="chapter-1" className={styles.anchorTarget}>
          <ArtHeroStage
            imageUrl={IMAGE_URL}
            imageAlt="René Magritte — Golconda, 1953"
            label={GOLCONDA_LABEL}
            palette={GOLCONDA_PALETTE}
            variant="glass"
          />
        </div>

        <div className={styles.chapterTransition} />

        <section id="chapter-2" className={styles.chapter2}>
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.chapter2Content}>
            <GolcondaImpression />
          </div>
        </section>

        <div className={styles.chapterTransition} />

        <ArtApplicationSection
          palette={GOLCONDA_PALETTE_ITEMS}
          buttons={GOLCONDA_BUTTONS}
          typography={GOLCONDA_TYPOGRAPHY}
          artCard={GOLCONDA_ART_CARD}
          variant="glass"
          sectionId="chapter-3"
        />
      </ArtShell>
    </div>
  );
}
