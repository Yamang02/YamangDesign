/**
 * E30 Ch.2 — border-image-slice + seamless 테두리, 별·달·나무 데칼
 */
import type { CSSProperties } from 'react';
import styles from './StarryNightFrame.module.css';

const SELF_PORTRAIT_URL = '/art/starry-night/self-portrait.jpg';

const MOON_URL = '/art/starry-night/A1%28moon%29.png';
const TREE_URL = '/art/starry-night/A2%28tree%29.png';

const HALO_URLS = [
  '/art/starry-night/Swirl_Halo_A.png',
  '/art/starry-night/Swirl_Halo_B.png',
  '/art/starry-night/Swirl_Halo_C.png',
  '/art/starry-night/Swirl_Halo_small.png',
] as const;

/** 시드 기반 0~1 (렌더마다 안정적인 pseudo-random) */
function seeded01(index: number, salt: number): number {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** 테두리 링(마스크) 안에만 보이도록 한 변을 고른 뒤 그 변을 따라 배치 */
function haloPlacementStyle(index: number): CSSProperties {
  const edge = Math.floor(seeded01(index, 10) * 4);
  const along = 0.1 + seeded01(index, 11) * 0.8;
  const depth = 0.03 + seeded01(index, 12) * 0.09;

  let left: string;
  let top: string;

  switch (edge) {
    case 0: {
      left = `${along * 100}%`;
      top = `${depth * 100}%`;
      break;
    }
    case 1: {
      left = `${(1 - depth) * 100}%`;
      top = `${along * 100}%`;
      break;
    }
    case 2: {
      left = `${along * 100}%`;
      top = `${(1 - depth) * 100}%`;
      break;
    }
    default: {
      left = `${depth * 100}%`;
      top = `${along * 100}%`;
      break;
    }
  }

  return {
    left,
    top,
    transform: 'translate(-50%, -50%)',
  };
}

function haloTwinkleStyle(index: number): CSSProperties {
  const durationSec = 3 + seeded01(index, 1) * 4.5;
  const delaySec = seeded01(index, 2) * 5;
  return {
    '--halo-duration': `${durationSec}s`,
    '--halo-delay': `${delaySec}s`,
  } as CSSProperties;
}

export function StarryNightFrame() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <div className={styles.haloRing} aria-hidden="true">
          {HALO_URLS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={styles.halo}
              style={{ ...haloPlacementStyle(i), ...haloTwinkleStyle(i) }}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        <div className={styles.imageWrap}>
          <img
            src={SELF_PORTRAIT_URL}
            alt="Vincent van Gogh — Self-Portrait"
            className={styles.image}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <img
            src={MOON_URL}
            alt=""
            className={styles.cornerMoon}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.cornerTreeOuter}>
            <img
              src={TREE_URL}
              alt=""
              className={styles.cornerTree}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
