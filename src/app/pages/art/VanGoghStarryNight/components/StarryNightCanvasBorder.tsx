/**
 * E30 Ch.2 — Canvas wavy ring (물결 외곽 + 안쪽 홀)
 *
 * 경로·패딩은 starryNightRingPath 와 공유 (clip-path 와 동일 시각).
 */
import { useLayoutEffect, useRef, type RefObject } from 'react';
import {
  computeWaveAmplitude,
  readPaddingPx,
  STARRY_RING_WAVES,
  traceInnerRoundedRectPath,
  traceOuterWavyPath,
  type CanvasMotionPreference,
} from './starryNightRingPath';
import styles from './StarryNightCanvasBorder.module.css';

export type { CanvasMotionPreference } from './starryNightRingPath';

const SEAMLESS_URL = '/art/starry-night/seamless_bg.png';
const FALLBACK_RING_FILL = '#2F4D96';

/** object-fit: cover 와 동일 — 링 전체를 덮도록 균일 확대 후 중앙 크롭 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  cw: number,
  ch: number
): void {
  if (iw <= 0 || ih <= 0 || cw <= 0 || ch <= 0) return;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function strokeOuterWavyPath(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  r: number,
  amp: number,
  waves: number
): void {
  ctx.beginPath();
  traceOuterWavyPath(ctx, W, H, r, amp, waves);
}

interface StarryNightCanvasBorderProps {
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly motionPreference?: CanvasMotionPreference;
}

export function StarryNightCanvasBorder({
  containerRef,
  motionPreference = 'system',
}: StarryNightCanvasBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = SEAMLESS_URL;

    const paint = () => {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const W = el.clientWidth;
      const H = el.clientHeight;
      if (W < 2 || H < 2) return;

      const { padX, padY } = readPaddingPx(el);

      const dpr = globalThis.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { reduce, waveAmp } = computeWaveAmplitude(W, H, motionPreference);

      const r = Math.min(12, Math.min(W, H) * 0.035);
      const innerR = Math.max(2, r * 0.55);
      const waves = STARRY_RING_WAVES;
      const iw = W - 2 * padX;
      const ih = H - 2 * padY;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);

      const paintRingBands = () => {
        ctx.fillStyle = FALLBACK_RING_FILL;
        ctx.fillRect(0, 0, W, padY);
        ctx.fillRect(0, H - padY, W, padY);
        ctx.fillRect(0, padY, padX, Math.max(0, H - 2 * padY));
        ctx.fillRect(W - padX, padY, padX, Math.max(0, H - 2 * padY));
        if (img.complete && img.naturalWidth > 0) {
          try {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, W, padY);
            ctx.rect(0, H - padY, W, padY);
            ctx.rect(0, padY, padX, Math.max(0, H - 2 * padY));
            ctx.rect(W - padX, padY, padX, Math.max(0, H - 2 * padY));
            ctx.clip();
            drawImageCover(ctx, img, img.naturalWidth, img.naturalHeight, W, H);
            ctx.restore();
          } catch {
            /* 단색 밴드만 */
          }
        }
      };

      if (iw > 1 && ih > 1) {
        ctx.save();
        ctx.beginPath();
        traceOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        traceInnerRoundedRectPath(ctx, padX, padY, iw, ih, innerR);
        ctx.clip('evenodd');

        ctx.fillStyle = FALLBACK_RING_FILL;
        ctx.fillRect(0, 0, W, H);

        if (img.complete && img.naturalWidth > 0) {
          try {
            drawImageCover(ctx, img, img.naturalWidth, img.naturalHeight, W, H);
          } catch {
            /* 단색만 */
          }
        }
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        traceInnerRoundedRectPath(ctx, padX, padY, iw, ih, innerR);
        ctx.strokeStyle = 'rgba(245, 200, 66, 0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      } else {
        paintRingBands();
      }

      if (iw > 1 && ih > 1) {
        strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        if (reduce || waveAmp <= 0.25) {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.22)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.14)';
          ctx.lineWidth = 3;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
          strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
          ctx.strokeStyle = 'rgba(255, 228, 160, 0.55)';
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }
      } else if (waveAmp > 0.25) {
        strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        ctx.strokeStyle = 'rgba(245, 200, 66, 0.22)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    };

    const paintSoon = () => {
      globalThis.requestAnimationFrame(paint);
    };

    img.onload = paintSoon;
    paintSoon();

    const ro = new ResizeObserver(paintSoon);
    ro.observe(el);

    const mq =
      motionPreference === 'system' && typeof globalThis.matchMedia === 'function'
        ? globalThis.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    mq?.addEventListener('change', paintSoon);

    return () => {
      ro.disconnect();
      mq?.removeEventListener('change', paintSoon);
      img.onload = null;
    };
  }, [containerRef, motionPreference]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
