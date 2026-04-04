/**
 * E30 Ch.2 — CSS border-image 또는 Canvas 물결 띠 + 별·달·나무 데칼
 */
import { useRef, useState, type CSSProperties } from 'react';
import { StarryNightCanvasBorder } from './StarryNightCanvasBorder';
import styles from './StarryNightFrame.module.css';

export type StarryNightFrameVariant = 'css' | 'canvas';

const SELF_PORTRAIT_URL = '/art/starry-night/self-portrait.jpg';

const MOON_URL = '/art/starry-night/A1%28moon%29.png';
const TREE_URL = '/art/starry-night/A2%28tree%29.png';

const HALO_URLS = [
  '/art/starry-night/Swirl_Halo_A.png',
  '/art/starry-night/Swirl_Halo_B.png',
  '/art/starry-night/Swirl_Halo_small.png',
] as const;

/** 테두리 링 안에서만 보이도록 변 + 깊이 랜덤 */
function randomHaloPlacement(): CSSProperties {
  const edge = Math.floor(Math.random() * 4);
  const along = 0.1 + Math.random() * 0.8;
  const depth = 0.03 + Math.random() * 0.09;

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

function randomHaloTwinkle(): CSSProperties {
  const durationSec = 3 + Math.random() * 4.5;
  const delaySec = Math.random() * 5;
  return {
    '--halo-duration': `${durationSec}s`,
    '--halo-delay': `${delaySec}s`,
  } as CSSProperties;
}

function buildHaloStyles(): CSSProperties[] {
  return HALO_URLS.map(() => ({
    ...randomHaloPlacement(),
    ...randomHaloTwinkle(),
  }));
}

interface StarryNightFrameProps {
  readonly variant?: StarryNightFrameVariant;
}

export function StarryNightFrame({ variant = 'canvas' }: StarryNightFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [haloStyles, setHaloStyles] = useState(() => buildHaloStyles());
  const frameClass =
    variant === 'css'
      ? `${styles.frame} ${styles.frameCss}`
      : `${styles.frame} ${styles.frameCanvas}`;

  return (
    <div className={styles.wrapper}>
      <div ref={frameRef} className={frameClass}>
        {variant === 'canvas' ? <StarryNightCanvasBorder containerRef={frameRef} /> : null}
        <div className={styles.haloRing} aria-hidden="true">
          {HALO_URLS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={styles.halo}
              style={haloStyles[i]}
              onAnimationIteration={() => {
                setHaloStyles((prev) =>
                  prev.map((style, idx) =>
                    idx === i ? { ...style, ...randomHaloPlacement() } : style
                  )
                );
              }}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        <div className={styles.imageWrap}>
          {variant === 'canvas' ? (
            <div className={styles.portraitCrop}>
              <img
                src={SELF_PORTRAIT_URL}
                alt="Vincent van Gogh — Self-Portrait"
                className={styles.image}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <img
              src={SELF_PORTRAIT_URL}
              alt="Vincent van Gogh — Self-Portrait"
              className={styles.image}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          )}
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
