/**
 * E22: Art Reference Gallery — Water Lilies, Claude Monet (1906)
 * Style: Glassmorphism
 *
 * Chapter 1 — The Painting: 원화 직접 참조, glass panels
 * Chapter 2 — The Impression: 심상 차용 인터랙티브 (animated gradient + ripple + color DNA)
 */
import { HeroStage } from './components/HeroStage';
import { ImpressionBackground } from './components/ImpressionBackground';
import { RippleCanvas } from './components/RippleCanvas';
import { ColorDNAMap } from './components/ColorDNAMap';
import { ImpressionistQuote } from './components/ImpressionistQuote';
import styles from './MonetWaterLilies.module.css';

export function MonetWaterLilies() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Chapter 1 */}
        <HeroStage />

        <div className={styles.chapterTransition} />

        {/* Chapter 2 */}
        <section className={styles.chapter2}>
          <ImpressionBackground />
          <RippleCanvas />
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.chapter2Content}>
            <ImpressionistQuote />
            <ColorDNAMap />
          </div>
        </section>
      </div>
    </div>
  );
}
