/**
 * E22: Art Reference Gallery — Water Lilies, Claude Monet (1914–18)
 * Style: Glassmorphism
 *
 * Chapter 1 — The Painting: 원화 직접 참조, museum label, palette swatches
 * Chapter 2 — The Impression: 심상 차용 인터랙티브 (animated gradient + ripple + glass quote card)
 * Chapter 3 — The Application: 모네 팔레트 × DS 토큰 컴포넌트 적용
 */
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { HeroStage } from './components/HeroStage';
import { ImpressionBackground } from './components/ImpressionBackground';
import { RippleCanvas } from './components/RippleCanvas';
import { ImpressionistQuote } from './components/ImpressionistQuote';
import { ComponentApplication } from './components/ComponentApplication';
import styles from './MonetWaterLilies.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

export function MonetWaterLilies() {
  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS}>
        {/* Chapter 1 */}
        <div id="chapter-1" className={styles.anchorTarget}>
          <HeroStage />
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
        <ComponentApplication />
      </ArtShell>
    </div>
  );
}
