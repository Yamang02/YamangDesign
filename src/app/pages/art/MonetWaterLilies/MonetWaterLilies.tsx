/**
 * E22: Art Reference Gallery — Water Lilies, Claude Monet (1914–18)
 * Style: Glassmorphism
 *
 * Chapter 1 — The Painting: 원화 직접 참조, museum label, palette swatches
 * Chapter 2 — The Impression: 심상 차용 인터랙티브 (animated gradient + ripple + glass quote card)
 * Chapter 3 — The Application: 모네 팔레트 × DS 토큰 컴포넌트 적용
 */
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { ArtHeroStage } from '../_shared/ArtHeroStage';
import type { LabelInfo } from '../_shared/ArtHeroStage';
import { ArtApplicationSection } from '../_shared/ArtApplicationSection';
import type { ArtPaletteItem, ArtButtonItem, ArtTypographyItem, ArtCardMeta } from '../_shared/ArtApplicationSection';
import { ImpressionBackground } from './components/ImpressionBackground';
import { RippleCanvas } from './components/RippleCanvas';
import { ImpressionistQuote } from './components/ImpressionistQuote';
import { MONET_PALETTE } from './monet-palette';
import styles from './MonetWaterLilies.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

const MONET_LABEL: LabelInfo = {
  title: 'Water Lilies: Green Reflections',
  artist: 'Claude Monet',
  medium: 'Oil on Canvas',
  year: 1914,
  yearEnd: 1918,
};

const IMAGE_URL = '/art/monet-water-lilies-green-reflections.png';

const MONET_PALETTE_ITEMS: ArtPaletteItem[] = [
  { name: 'Deep Green',  hex: '#2D5016', role: 'Primary' },
  { name: 'Sage',        hex: '#7A9E5F', role: 'Muted' },
  { name: 'Lavender',    hex: '#9B8BB4', role: 'Sub' },
  { name: 'Smoke White', hex: '#E8E4D5', role: 'Surface' },
  { name: 'Teal',        hex: '#3D7A6E', role: 'Secondary' },
  { name: 'Mustard',     hex: '#C4A84F', role: 'Accent' },
  { name: 'Deep Purple', hex: '#4A3560', role: 'Deep' },
  { name: 'Water Blue',  hex: '#5B8FA8', role: 'Info' },
];

const MONET_BUTTONS: ArtButtonItem[] = [
  { label: 'Primary',   hex: '#2D5016', textHex: '#E8E4D5' },
  { label: 'Secondary', hex: '#3D7A6E', textHex: '#E8E4D5' },
  { label: 'Accent',    hex: '#C4A84F', textHex: '#1a1a10' },
  { label: 'Ghost',     hex: 'transparent', textHex: 'rgba(232,228,213,0.8)' },
];

const MONET_TYPOGRAPHY: ArtTypographyItem[] = [
  { level: 'Display', text: 'Water Lilies', hex: '#E8E4D5' },
  { level: 'Body',    text: "Monet's late masterworks blur the boundary between abstraction and observation, dissolving form into light, water, and colour.", hex: '#9B8BB4' },
  { level: 'Caption', text: 'Impressionism · 1914–18 · Oil on Canvas', hex: '#C4A84F' },
];

const MONET_ART_CARD: ArtCardMeta = {
  imageUrl: IMAGE_URL,
  title: 'Water Lilies: Green Reflections',
  artist: 'Claude Monet',
  year: '1914–18',
  movement: 'Impressionism',
  styleTag: 'Glassmorphism',
};

export function MonetWaterLilies() {
  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS}>
        {/* Chapter 1 */}
        <div id="chapter-1" className={styles.anchorTarget}>
          <ArtHeroStage
            imageUrl={IMAGE_URL}
            imageAlt="Claude Monet — Water Lilies: Green Reflections, central section, 1914–18"
            label={MONET_LABEL}
            palette={MONET_PALETTE}
          />
        </div>

        <div className={styles.chapterTransition} />

        {/* Chapter 2 */}
        <section id="chapter-2" className={styles.chapter2}>
          <ImpressionBackground />
          <RippleCanvas />
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.chapter2Content}>
            <ImpressionistQuote />
          </div>
        </section>

        <div className={styles.chapterTransition} />

        {/* Chapter 3 */}
        <ArtApplicationSection
          palette={MONET_PALETTE_ITEMS}
          buttons={MONET_BUTTONS}
          typography={MONET_TYPOGRAPHY}
          artCard={MONET_ART_CARD}
          sectionId="chapter-3"
        />
      </ArtShell>
    </div>
  );
}
