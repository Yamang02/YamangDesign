import { useRef, useCallback } from 'react';
import styles from './BrutalTypographyQuote.module.css';

const WORD = 'DANCE';
const COLORS = ['#C8361A', '#2E6B35', '#1A4F8C'];

export function BrutalTypographyQuote() {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      const maxDist = 300;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const colorIndex = Math.floor(proximity * COLORS.length) % COLORS.length;
      el.style.color = proximity > 0.05 ? COLORS[colorIndex] : '#F2EFE8';
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    letterRefs.current.forEach((el) => {
      if (el) el.style.color = '#F2EFE8';
    });
  }, []);

  return (
    <div
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 거대 타이포 */}
      <div className={styles.wordRow} aria-label={WORD}>
        {WORD.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el; }}
            className={styles.letter}
            aria-hidden
          >
            {char}
          </span>
        ))}
      </div>

      {/* 인용구 카드 */}
      <blockquote className={styles.card}>
        <p className={styles.quote}>&ldquo;Creativity takes courage.&rdquo;</p>
        <cite className={styles.cite}>— Henri Matisse</cite>
      </blockquote>
    </div>
  );
}
