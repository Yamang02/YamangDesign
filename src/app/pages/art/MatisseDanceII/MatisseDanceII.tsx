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

        {/* Chapter 3 — placeholder */}
        <section id="chapter-3" className={styles.chapter3Placeholder}>
          <span className={styles.placeholderLabel}>Chapter 3 — The Application (coming soon)</span>
        </section>
      </ArtShell>
    </div>
  );
}
