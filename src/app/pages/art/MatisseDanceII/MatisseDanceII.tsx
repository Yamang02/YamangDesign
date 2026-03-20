/**
 * E23: Art Reference Gallery — La Danse (II), Henri Matisse (1910)
 * Style: Brutalism
 *
 * Chapter 1 — The Painting: 원화 직접 참조, museum label, palette swatches
 * Chapter 2 — The Impression: 브루탈 타이포그래피 인터랙션
 * Chapter 3 — The Application: 마티스 팔레트 × DS 토큰 컴포넌트 적용
 */
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { ArtHeroStage } from '../_shared/ArtHeroStage';
import type { LabelInfo } from '../_shared/ArtHeroStage';
import { ArtApplicationSection } from '../_shared/ArtApplicationSection';
import type { ArtPaletteItem, ArtButtonItem, ArtTypographyItem, ArtCardMeta } from '../_shared/ArtApplicationSection';
import { MATISSE_PALETTE } from './matisse-palette';
import { BrutalBackground } from './components/BrutalBackground';
import { BrutalTypographyQuote } from './components/BrutalTypographyQuote';
import styles from './MatisseDanceII.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

const IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Matissedance.jpg';

const MATISSE_PALETTE_ITEMS: ArtPaletteItem[] = [
  { name: 'Matisse Red',  hex: '#C8361A', role: 'Primary' },
  { name: 'Dance Green',  hex: '#2E6B35', role: 'Secondary' },
  { name: 'Sky Blue',     hex: '#1A4F8C', role: 'Accent' },
  { name: 'Cement',       hex: '#B0A89A', role: 'Neutral' },
  { name: 'Raw White',    hex: '#F2EFE8', role: 'Surface' },
  { name: 'Charcoal',     hex: '#1C1C1C', role: 'Dark' },
]

const MATISSE_BUTTONS: ArtButtonItem[] = [
  { label: 'Primary',   hex: '#C8361A', textHex: '#F2EFE8' },
  { label: 'Secondary', hex: '#2E6B35', textHex: '#F2EFE8' },
  { label: 'Accent',    hex: '#1A4F8C', textHex: '#F2EFE8' },
  { label: 'Ghost',     hex: 'transparent', textHex: '#1C1C1C' },
]

const MATISSE_TYPOGRAPHY: ArtTypographyItem[] = [
  { level: 'Display', text: 'La Danse',              hex: '#C8361A' },
  { level: 'Body',    text: 'Creativity takes courage.', hex: '#1C1C1C' },
  { level: 'Caption', text: 'Henri Matisse, 1910',   hex: '#B0A89A' },
]

const MATISSE_ART_CARD: ArtCardMeta = {
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Matissedance.jpg',
  title: 'La Danse (II)',
  artist: 'Henri Matisse',
  year: 1910,
  movement: 'Post-Impressionism',
  styleTag: 'Brutalism',
}

const MATISSE_LABEL: LabelInfo = {
  title: 'La Danse (II)',
  artist: 'Henri Matisse',
  medium: 'Oil on canvas',
  year: 1910,
};

export function MatisseDanceII() {
  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS}>
        {/* Chapter 1 */}
        <div id="chapter-1" className={styles.anchorTarget}>
          <ArtHeroStage
            imageUrl={IMAGE_URL}
            imageAlt="Henri Matisse — La Danse (II), 1910"
            label={MATISSE_LABEL}
            palette={MATISSE_PALETTE}
            variant="brutal"
          />
        </div>

        <div className={styles.chapterTransition} />

        {/* Chapter 2 — The Impression */}
        <section id="chapter-2" className={styles.chapter2}>
          <BrutalBackground />
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.chapter2Content}>
            <BrutalTypographyQuote />
          </div>
        </section>

        <div className={styles.chapterTransition} />

        {/* Chapter 3 */}
        <ArtApplicationSection
          palette={MATISSE_PALETTE_ITEMS}
          buttons={MATISSE_BUTTONS}
          typography={MATISSE_TYPOGRAPHY}
          artCard={MATISSE_ART_CARD}
          variant="brutal"
          sectionId="chapter-3"
        />
      </ArtShell>
    </div>
  );
}
