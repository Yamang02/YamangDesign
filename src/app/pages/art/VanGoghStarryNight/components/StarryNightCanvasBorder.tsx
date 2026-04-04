/**
 * E30 Ch.2 — Canvas wavy ring stroke overlay (물결 외곽 + 안쪽 홀 스트로크)
 *
 * 텍스처 채우기는 CSS 레이어가 담당하고, 캔버스는 stroke만 담당한다.
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

/** CSS `border-image` / Canvas 링 공통 — 페이지 `preload`와 경로 일치 */
export const STARRY_NIGHT_SEAMLESS_BG_URL = '/art/starry-night/seamless_bg.png';

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
  /** 부모에서 링 `clip-path` d 계산 완료 — 레이아웃·스트로크 동기 재페인트 */
  readonly ringClipPathReady?: boolean;
  readonly motionPreference?: CanvasMotionPreference;
}

export function StarryNightCanvasBorder({
  containerRef,
  ringClipPathReady = false,
  motionPreference = 'full',
}: StarryNightCanvasBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const paint = () => {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const W = el.clientWidth;
      const H = el.clientHeight;
      if (W < 2 || H < 2) {
        return;
      }

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

      if (iw > 1 && ih > 1) {
        ctx.save();
        ctx.beginPath();
        traceInnerRoundedRectPath(ctx, padX, padY, iw, ih, innerR);
        /* CSS 텍스처 위에서도 보이도록 대비 유지 (이전 단색 채움 대비) */
        ctx.strokeStyle = 'rgba(245, 200, 66, 0.48)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      if (iw > 1 && ih > 1) {
        strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        if (reduce || waveAmp <= 0.25) {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.58)';
          ctx.lineWidth = 1.15;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.42)';
          ctx.lineWidth = 2.75;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
          strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
          ctx.strokeStyle = 'rgba(255, 228, 160, 0.82)';
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }
      } else if (waveAmp > 0.25) {
        strokeOuterWavyPath(ctx, W, H, r, waveAmp, waves);
        ctx.strokeStyle = 'rgba(245, 200, 66, 0.58)';
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }
    };

    const paintSoon = () => {
      globalThis.requestAnimationFrame(paint);
    };

    /** 첫 컴포지트 이후에도 스트로크가 비는 경우 대비 — 뷰포트·가시성 변화 때 한 번 더 그림 */
    const repaintAfterViewportSignal = () => {
      globalThis.requestAnimationFrame(() => {
        globalThis.requestAnimationFrame(paintSoon);
      });
    };

    paintSoon();

    let layoutRetries = 0;
    const MAX_LAYOUT_RETRIES = 90;
    const paintWhenSized = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w >= 2 && h >= 2) {
        layoutRetries = 0;
        paintSoon();
        return;
      }
      if (layoutRetries < MAX_LAYOUT_RETRIES) {
        layoutRetries += 1;
        globalThis.requestAnimationFrame(paintWhenSized);
      }
    };
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(paintWhenSized);
    });

    const ro = new ResizeObserver(() => {
      layoutRetries = 0;
      paintSoon();
    });
    ro.observe(el);

    const mq =
      motionPreference === 'system' && typeof globalThis.matchMedia === 'function'
        ? globalThis.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const onMqChange = () => {
      paintSoon();
    };
    mq?.addEventListener('change', onMqChange);

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === el && entry.isIntersecting) {
              repaintAfterViewportSignal();
            }
          }
        },
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      intersectionObserver.observe(el);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        repaintAfterViewportSignal();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const vv = globalThis.visualViewport;
    const onVisualViewportChange = () => {
      repaintAfterViewportSignal();
    };
    vv?.addEventListener('resize', onVisualViewportChange);

    const onPageShow = () => {
      repaintAfterViewportSignal();
    };
    globalThis.addEventListener('pageshow', onPageShow);

    let clipReadyTimer: number | undefined;
    if (ringClipPathReady) {
      repaintAfterViewportSignal();
      clipReadyTimer = globalThis.setTimeout(() => {
        paintSoon();
      }, 160);
    }

    return () => {
      if (clipReadyTimer !== undefined) {
        globalThis.clearTimeout(clipReadyTimer);
      }
      ro.disconnect();
      mq?.removeEventListener('change', onMqChange);
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      vv?.removeEventListener('resize', onVisualViewportChange);
      globalThis.removeEventListener('pageshow', onPageShow);
    };
  }, [containerRef, motionPreference, ringClipPathReady]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
