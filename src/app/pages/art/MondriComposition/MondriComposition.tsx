/**
 * E24: Art Reference Gallery — Composition with Large Blue Plane, Piet Mondrian (1921)
 * Style: Minimalism (muted)
 *
 * Chapter 1 — The Painting: 원화 직접 참조, museum label, palette swatches
 * Chapter 2 — The Impression: 격자 셀 마우스 인터랙션 (MondriGrid)
 * Chapter 3 — The Application: 몬드리안 팔레트 × DS 토큰 컴포넌트 적용
 */
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { ArtHeroStage } from '../_shared/ArtHeroStage';
import type { LabelInfo } from '../_shared/ArtHeroStage';
import { ArtApplicationSection } from '../_shared/ArtApplicationSection';
import type { ArtPaletteItem, ArtButtonItem, ArtTypographyItem, ArtCardMeta } from '../_shared/ArtApplicationSection';
import { MONDRI_PALETTE } from './mondri-palette';
import { GridBackground } from './components/GridBackground';
import { MondriGrid } from './components/MondriGrid';
import { MondrianQuote } from './components/MondrianQuote';
import styles from './MondriComposition.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

const IMAGE_URL = '/art/mondri-composition/hero.png';

const MONDRI_PALETTE_ITEMS: ArtPaletteItem[] = [
  { name: 'Mondrian Blue',   hex: '#7A9BBF', role: 'Primary' },
  { name: 'Grid Black',      hex: '#1C1C1C', role: 'Secondary' },
  { name: 'Mondrian Red',    hex: '#C47A6A', role: 'Accent' },
  { name: 'Mondrian Yellow', hex: '#D4C06A', role: 'Sub' },
  { name: 'Canvas White',    hex: '#F5F2EC', role: 'Surface' },
  { name: 'Ash Gray',        hex: '#B0ADA8', role: 'Muted' },
  { name: 'Dark Slate',      hex: '#2E2E2E', role: 'Deep' },
  { name: 'Pale Stone',      hex: '#E0DDD8', role: 'Info' },
];

const MONDRI_BUTTONS: ArtButtonItem[] = [
  { label: 'Primary',   hex: '#7A9BBF', textHex: '#F5F2EC' },
  { label: 'Secondary', hex: '#1C1C1C', textHex: '#F5F2EC' },
  { label: 'Accent',    hex: '#C47A6A', textHex: '#F5F2EC' },
  { label: 'Ghost',     hex: 'transparent', textHex: '#1C1C1C' },
];

const MONDRI_TYPOGRAPHY: ArtTypographyItem[] = [
  { level: 'Display', text: 'Composition',          hex: '#1C1C1C' },
  { level: 'Body',    text: 'De Stijl reduced form to its essence — line, plane, and the primary three.', hex: '#B0ADA8' },
  { level: 'Caption', text: 'Neoplasticism · 1921 · Oil on Canvas', hex: '#D4C06A' },
];

const MONDRI_ART_CARD: ArtCardMeta = {
  imageUrl: IMAGE_URL,
  title: 'Composition with Large Blue Plane',
  artist: 'Piet Mondrian',
  year: 1921,
  movement: 'De Stijl',
  styleTag: 'Minimalism',
};

const MONDRI_LABEL: LabelInfo = {
  title: 'Composition with Large Blue Plane,',
  subtitle: 'Red, Black, Yellow, and Gray',
  artist: 'Piet Mondrian',
  medium: 'Oil on Canvas',
  year: 1921,
};

export function MondriComposition() {
  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS} theme="dark">
        {/* Chapter 1 */}
        <div id="chapter-1" className={styles.anchorTarget}>
          <ArtHeroStage
            imageUrl={IMAGE_URL}
            imageAlt="Piet Mondrian — Composition with Large Blue Plane, Red, Black, Yellow, and Gray, 1921"
            label={MONDRI_LABEL}
            palette={MONDRI_PALETTE}
            variant="minimal"
          />
        </div>

        <div className={styles.chapterTransition} />

        {/* Chapter 2 */}
        <section id="chapter-2" className={styles.chapter2}>
          <GridBackground />
          <MondriGrid />
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.chapter2Content}>
            <MondrianQuote />
          </div>
        </section>

        <div className={styles.chapterTransition} />

        {/* Chapter 3 */}
        <ArtApplicationSection
          palette={MONDRI_PALETTE_ITEMS}
          buttons={MONDRI_BUTTONS}
          typography={MONDRI_TYPOGRAPHY}
          artCard={MONDRI_ART_CARD}
          variant="minimal"
          sectionId="chapter-3"
        />
      </ArtShell>
    </div>
  );
}
