/**
 * E28 Ch.2 — Golconda 배경 + ASCII 신사 낙하 + 우산 커서
 */
import { useEffect, useRef } from 'react';
import { GENTLEMAN_TIERS } from './gentlemen';
import { buildMicrotextSilhouette, layoutMicrotextWithPretext } from './gentlemanSilhouette';
import {
  drawParticles,
  drawUmbrella,
  initParticles,
  type GentlemanParticle,
  type TierDrawCache,
  updateParticles,
} from './GentlemanRain';
import { getRooflineYFromTable, scanRooflineYTable } from './buildingMask';
import styles from './GolcondaImpression.module.css';

const BG_URL = '/art/golconda/background.png';

/** Courier New 고정 — 로캘별 U+005C(₩) 표기 차이를 줄이기 위함 */
function buildTierCaches(): Map<string, TierDrawCache> {
  const m = new Map<string, TierDrawCache>();
  for (const tier of GENTLEMAN_TIERS) {
    const font = `${tier.microFontPx}px "Courier New", Courier, monospace`;
    const sil = buildMicrotextSilhouette(tier.cellW, tier.cellH, tier.microFontPx);
    const laid = layoutMicrotextWithPretext(sil, font);
    m.set(tier.id, {
      font,
      layoutLines: laid.layoutLines,
      lineHeightLayout: laid.lineHeight,
      layoutHeight: laid.layoutHeight,
      maxLineWidth: laid.maxLineWidth,
    });
  }
  return m;
}

export function GolcondaImpression() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GentlemanParticle[]>([]);
  const cachesRef = useRef<Map<string, TierDrawCache> | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, inBounds: false });
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const rooflineTableRef = useRef<Float32Array | null>(null);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 1, h: 1 });

  useEffect(() => {
    const img = new Image();
    img.src = BG_URL;
    img.onload = () => {
      bgImageRef.current = img;
      const { w, h } = sizeRef.current;
      if (w >= 2 && h >= 2) {
        try {
          rooflineTableRef.current = scanRooflineYTable(img, w, h);
        } catch {
          rooflineTableRef.current = null;
        }
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    cachesRef.current = buildTierCaches();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      sizeRef.current = { w, h };
      const dpr = window.devicePixelRatio ?? 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(w, h);
      }
      const bg = bgImageRef.current;
      if (bg?.complete && bg.naturalWidth > 0) {
        try {
          rooflineTableRef.current = scanRooflineYTable(bg, w, h);
        } catch {
          rooflineTableRef.current = null;
        }
      } else {
        rooflineTableRef.current = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerRef.current = {
        x,
        y,
        inBounds: x >= 0 && x <= rect.width && y >= 0 && y <= rect.height,
      };
    };
    const onLeave = () => {
      pointerRef.current.inBounds = false;
    };

    const ro = new ResizeObserver(() => {
      syncCanvasSize();
    });
    ro.observe(container);
    syncCanvasSize();

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    const loop = () => {
      const { w, h } = sizeRef.current;
      if (w < 2 || h < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      const bg = bgImageRef.current;
      if (bg?.complete && bg.naturalWidth > 0) {
        ctx.drawImage(bg, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#c5d4e0';
        ctx.fillRect(0, 0, w, h);
      }

      const caches = cachesRef.current;
      if (!caches) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const umbrella = pointerRef.current.inBounds
        ? { x: pointerRef.current.x, y: pointerRef.current.y }
        : null;
      updateParticles(particlesRef.current, w, h, caches, umbrella);
      const roofAtX = (x: number) =>
        getRooflineYFromTable(rooflineTableRef.current, h, w, x);
      drawParticles(ctx, particlesRef.current, caches, w, h, roofAtX);
      if (umbrella) {
        drawUmbrella(ctx, umbrella.x, umbrella.y);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.root}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Golconda 인상 — 비처럼 내리는 신사와 우산 커서"
      />
      <div className={styles.quote}>
        <p className={styles.quoteText}>
          Everything we see hides another thing, we always want to see what is hidden by what we see.
        </p>
        <span className={styles.quoteSource}>— René Magritte</span>
      </div>
    </div>
  );
}
