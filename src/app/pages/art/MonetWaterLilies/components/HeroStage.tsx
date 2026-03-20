import { useEffect, useRef, useState } from 'react';
import { ArtworkInfoCard } from './ArtworkInfoCard';
import { PaletteSwatchBar } from './PaletteSwatchBar';
import styles from './HeroStage.module.css';

const IMAGE_URL =
  'https://www.art-prints-on-demand.com/kunst/claude_monet/Seerosen-Gruene-Reflektionen-mittlere-Teil.jpg';

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [blurPx, setBlurPx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const { top, height } = stage.getBoundingClientRect();
      // 0 at top of stage, 1 at bottom of first 100vh
      const progress = Math.min(Math.max(-top / (height / 2), 0), 1);
      setBlurPx(progress * 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={stageRef} className={styles.stage}>
      <div className={styles.stickyBg}>
        <img
          src={IMAGE_URL}
          alt="Claude Monet — Water Lilies, 1906"
          className={styles.image}
          style={{ filter: `blur(${blurPx}px) saturate(${1 + blurPx * 0.02})` }}
        />
        <div className={styles.overlay} />
        <div className={styles.panels}>
          <span className={styles.chapterLabel}>Chapter 1 — The Painting</span>
          <ArtworkInfoCard />
          <PaletteSwatchBar />
        </div>
      </div>
    </section>
  );
}
