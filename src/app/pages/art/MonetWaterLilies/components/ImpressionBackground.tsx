import type { CSSProperties } from 'react';
import styles from './ImpressionBackground.module.css';

/** CSS 변수 애니메이션용 (모듈 CSS와 맞춤) */
type MotifMotionStyle = CSSProperties & {
  '--op'?: number;
  '--dur'?: string;
  '--delay'?: string;
  '--blur'?: string;
  '--rot'?: string;
};

export function ImpressionBackground() {
  const motifs = [
    // Petals (연꽃 꽃잎 느낌: 둥근/퍼진 radial)
    { id: 'p1', kind: 'petal', left: '12%', top: '62%', size: 70, opacity: 0.08, dur: 18, delay: -10, blur: 7, rot: -12 },
    { id: 'p2', kind: 'petal', left: '24%', top: '32%', size: 60, opacity: 0.07, dur: 22, delay: -14, blur: 8, rot: 8 },
    { id: 'p3', kind: 'petal', left: '48%', top: '58%', size: 80, opacity: 0.06, dur: 20, delay: -6, blur: 9, rot: 18 },
    { id: 'p4', kind: 'petal', left: '72%', top: '40%', size: 65, opacity: 0.06, dur: 26, delay: -18, blur: 8, rot: -20 },

    // Leaves (연잎 느낌: 타원 + 그린 방사형)
    { id: 'l1', kind: 'leaf', left: '18%', top: '76%', size: 90, opacity: 0.05, dur: 26, delay: -16, blur: 10, rot: -22 },
    { id: 'l2', kind: 'leaf', left: '38%', top: '78%', size: 75, opacity: 0.045, dur: 28, delay: -9, blur: 9, rot: 12 },
    { id: 'l3', kind: 'leaf', left: '60%', top: '72%', size: 88, opacity: 0.04, dur: 30, delay: -13, blur: 11, rot: -6 },
    { id: 'l4', kind: 'leaf', left: '82%', top: '66%', size: 80, opacity: 0.04, dur: 24, delay: -8, blur: 10, rot: 22 },

    // Small accents (아주 작은 꽃잎/거품 같은 잔상)
    { id: 's1', kind: 'accent', left: '55%', top: '30%', size: 45, opacity: 0.035, dur: 22, delay: -9, blur: 8, rot: 0 },
    { id: 's2', kind: 'accent', left: '30%', top: '48%', size: 38, opacity: 0.03, dur: 26, delay: -14, blur: 8, rot: -8 },
    { id: 's3', kind: 'accent', left: '78%', top: '54%', size: 45, opacity: 0.032, dur: 24, delay: -6, blur: 9, rot: 10 },

    // extra tiny glints
    { id: 's4', kind: 'accent', left: '16%', top: '44%', size: 32, opacity: 0.022, dur: 28, delay: -12, blur: 7, rot: -14 },
    { id: 's5', kind: 'accent', left: '68%', top: '26%', size: 30, opacity: 0.02, dur: 30, delay: -18, blur: 8, rot: 6 },
    { id: 's6', kind: 'accent', left: '84%', top: '38%', size: 28, opacity: 0.018, dur: 26, delay: -10, blur: 7, rot: 16 },
  ];

  return (
    <div className={styles.bg} aria-hidden>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />

      <div className={styles.motifs} aria-hidden>
        {motifs.map((m) => {
          const style: MotifMotionStyle = {
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            '--op': m.opacity,
            '--dur': `${m.dur}s`,
            '--delay': `${m.delay}s`,
            '--blur': `${m.blur}px`,
            '--rot': `${m.rot}deg`,
          };
          return (
            <div
              key={m.id}
              className={`${styles.motif} ${styles[m.kind]}`}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}
