/**
 * E30 Ch.2 — Canvas wavy ring (물결 외곽 + 안쪽 홀)
 *
 * 안정성 우선 렌더링:
 * 1) 바깥 직사각 + 안쪽 라운드 사각을 한 경로로 두고 `clip('evenodd')` → 링 모양만 그리기 허용
 * 2) 단색 fillRect + (로드 시) 텍스처 drawImage cover
 * 3) `destination-out` 미사용 — 합성/알파 환경에서 링이 통째로 사라지는 케이스 회피
 * 4) 마지막에 외곽 물결 stroke 장식
 */
import { useLayoutEffect, useRef, type RefObject } from 'react';
import styles from './StarryNightCanvasBorder.module.css';

const SEAMLESS_URL = '/art/starry-night/seamless_bg.png';
const FALLBACK_RING_FILL = '#2F4D96';
const DEFAULT_PAD_X = 44;
const DEFAULT_PAD_Y = 36;

function readPaddingPx(el: HTMLElement): { padX: number; padY: number } {
  const cs = getComputedStyle(el);
  /** CSS 변수와 실제 padding 이 어긋날 때를 대비해 변수 우선 */
  const fromVarX = Number.parseFloat(cs.getPropertyValue('--starryBorderX').trim());
  const fromVarY = Number.parseFloat(cs.getPropertyValue('--starryBorderY').trim());
  const pl = Number.parseFloat(cs.paddingLeft);
  const pt = Number.parseFloat(cs.paddingTop);
  const padX =
    Number.isFinite(fromVarX) && fromVarX > 0
      ? fromVarX
      : Number.isFinite(pl) && pl > 0
        ? pl
        : DEFAULT_PAD_X;
  const padY =
    Number.isFinite(fromVarY) && fromVarY > 0
      ? fromVarY
      : Number.isFinite(pt) && pt > 0
        ? pt
        : DEFAULT_PAD_Y;
  return { padX, padY };
}

function traceOuterWavyPath(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  r: number,
  amp: number,
  waves: number
): void {
  const spanX = W - 2 * r;
  const spanY = H - 2 * r;
  const steps = Math.max(28, Math.floor(Math.min(W, H) / 10));

  ctx.moveTo(0, r);
  ctx.arc(r, r, r, Math.PI, -Math.PI / 2, false);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = r + t * spanX;
    const taper = Math.sin(Math.PI * t);
    const y = taper * amp * Math.sin(2 * Math.PI * waves * t);
    ctx.lineTo(x, y);
  }

  ctx.arc(W - r, r, r, -Math.PI / 2, 0, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = r + t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = W + taper * amp * Math.sin(2 * Math.PI * waves * t + 1.1);
    ctx.lineTo(x, y);
  }

  ctx.arc(W - r, H - r, r, 0, Math.PI / 2, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = W - r - t * spanX;
    const taper = Math.sin(Math.PI * t);
    const y = H + taper * amp * Math.sin(2 * Math.PI * waves * t + 2.2);
    ctx.lineTo(x, y);
  }

  ctx.arc(r, H - r, r, Math.PI / 2, Math.PI, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = H - r - t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = taper * amp * Math.sin(2 * Math.PI * waves * t + 3.3);
    ctx.lineTo(x, y);
  }

  ctx.closePath();
}

function traceInnerRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number
): void {
  const cornerR = Math.min(rad, w / 2, h / 2);
  if (w <= 0 || h <= 0) return;

  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, cornerR);
    return;
  }

  ctx.moveTo(x + cornerR, y);
  ctx.lineTo(x + w - cornerR, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + cornerR);
  ctx.lineTo(x + w, y + h - cornerR);
  ctx.quadraticCurveTo(x + w, y + h, x + w - cornerR, y + h);
  ctx.lineTo(x + cornerR, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - cornerR);
  ctx.lineTo(x, y + cornerR);
  ctx.quadraticCurveTo(x, y, x + cornerR, y);
  ctx.closePath();
}

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
}

export function StarryNightCanvasBorder({ containerRef }: StarryNightCanvasBorderProps) {
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

      const reduce =
        typeof globalThis.matchMedia === 'function' &&
        globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const baseAmp = Math.min(5, Math.min(W, H) * 0.013);
      const waveAmp = reduce ? 0 : baseAmp;

      const r = Math.min(12, Math.min(W, H) * 0.035);
      const innerR = Math.max(2, r * 0.55);
      const waves = 2.35;
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
        ctx.rect(0, 0, W, H);
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
      } else {
        paintRingBands();
      }

      if (waveAmp > 0.25) {
        strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        ctx.strokeStyle = 'rgba(245, 200, 66, 0.22)';
        ctx.lineWidth = 1.25;
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
      typeof globalThis.matchMedia === 'function'
        ? globalThis.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    mq?.addEventListener('change', paintSoon);

    return () => {
      ro.disconnect();
      mq?.removeEventListener('change', paintSoon);
      img.onload = null;
    };
  }, [containerRef]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
