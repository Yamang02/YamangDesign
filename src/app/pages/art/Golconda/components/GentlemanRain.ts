import type { LayoutLine } from '@chenglou/pretext';
import { getRooflineY } from './buildingMask';
import { GENTLEMAN_TIERS, tierById, type GentlemanTier } from './gentlemen';

export type GentlemanParticle = {
  x: number
  y: number
  tierId: string
  /** 각 layout 줄의 가로 미끄러짐 (px) — M·L만 우산과 상호작용, XS·S는 사용 안 함 */
  lineSlides: number[]
  lineSlideV: number[]
}

/** 마이크로텍스트 실루엣 + Pretext layoutWithLines (티어당 1회) */
export type TierDrawCache = {
  font: string
  layoutLines: LayoutLine[]
  lineHeightLayout: number
  layoutHeight: number
  maxLineWidth: number
}

const PARTICLE_COUNT = 48;
const UMBRELLA_RADIUS = 80;
const LINE_PUSH = 2.8;
const SLIDE_DAMP = 0.91;
const SLIDE_SPRING = 0.045;
const NEIGHBOR_SPREAD = 0.14;
const MAX_SLIDE = 140;

/** 가장 작은 두 단계(XS·S)는 우산 피해 흘러내리기 없음 — M·L만 */
function tierReactsToUmbrella(tierId: string): boolean {
  return tierId === 'm' || tierId === 'l';
}

function ensureLineSlideBuffers(p: GentlemanParticle, lineCount: number): void {
  if (p.lineSlides.length === lineCount) return;
  p.lineSlides = new Array(lineCount).fill(0);
  p.lineSlideV = new Array(lineCount).fill(0);
}

export function initParticles(width: number, height: number): GentlemanParticle[] {
  const out: GentlemanParticle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const tier = GENTLEMAN_TIERS[Math.floor(Math.random() * GENTLEMAN_TIERS.length)] as GentlemanTier;
    out.push({
      x: Math.random() * Math.max(width, 1),
      y: -Math.random() * height * 1.4 - 60,
      tierId: tier.id,
      lineSlides: [],
      lineSlideV: [],
    });
  }
  return out;
}

export function updateParticles(
  particles: GentlemanParticle[],
  width: number,
  height: number,
  caches: Map<string, TierDrawCache>,
  umbrella: { x: number; y: number } | null,
): void {
  for (const p of particles) {
    const tier = tierById(p.tierId);
    const cache = caches.get(p.tierId);
    if (!tier || !cache) continue;

    const lines = cache.layoutLines;
    const lh = cache.lineHeightLayout;
    const n = lines.length;
    ensureLineSlideBuffers(p, n);

    p.y += tier.speed;

    const reactsUmbrella = tierReactsToUmbrella(p.tierId);

    if (reactsUmbrella) {
      if (umbrella) {
        const ux = umbrella.x;
        const uy = umbrella.y;
        for (let i = 0; i < n; i++) {
          const line = lines[i] as LayoutLine;
          const slide = p.lineSlides[i];
          const lineLeft = p.x + slide;
          const lineCx = lineLeft + line.width * 0.5;
          const lineCy = p.y + i * lh + lh * 0.5;
          const dx = lineCx - ux;
          const dy = lineCy - uy;
          const dist = Math.hypot(dx, dy);
          if (dist < UMBRELLA_RADIUS && dist > 1e-3) {
            const nx = dx / dist;
            const t = 1 - dist / UMBRELLA_RADIUS;
            p.lineSlideV[i] += nx * LINE_PUSH * t;
          }
        }
      }

      if (n > 1) {
        const spread = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          if (i > 0) spread[i] += (p.lineSlides[i - 1] - p.lineSlides[i]) * NEIGHBOR_SPREAD;
          if (i < n - 1) spread[i] += (p.lineSlides[i + 1] - p.lineSlides[i]) * NEIGHBOR_SPREAD;
        }
        for (let i = 0; i < n; i++) {
          p.lineSlideV[i] += spread[i];
        }
      }

      for (let i = 0; i < n; i++) {
        p.lineSlideV[i] -= p.lineSlides[i] * SLIDE_SPRING;
        p.lineSlideV[i] *= SLIDE_DAMP;
        p.lineSlides[i] += p.lineSlideV[i];
        p.lineSlides[i] = Math.max(-MAX_SLIDE, Math.min(MAX_SLIDE, p.lineSlides[i]));
      }
    } else {
      p.lineSlides.fill(0);
      p.lineSlideV.fill(0);
    }

    if (p.y > height + 140) {
      p.y = -Math.random() * height * 0.9 - 100;
      p.x = Math.random() * Math.max(width, 1);
      p.lineSlides = [];
      p.lineSlideV = [];
    }
    if (p.x < -160) p.x = width + 80;
    if (p.x > width + 160) p.x = -80;
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: readonly GentlemanParticle[],
  caches: Map<string, TierDrawCache>,
  cssWidth: number,
  cssHeight: number,
  /** 제공 시 이미지 스캔 LUT 기준 지붕선; 없으면 해석 근사 */
  roofYAtX?: (x: number) => number,
): void {
  ctx.textBaseline = 'top';
  for (const p of particles) {
    const tier = tierById(p.tierId);
    const cache = caches.get(p.tierId);
    if (!tier || !cache) continue;

    ctx.font = cache.font;
    ctx.fillStyle = `rgba(28, 32, 40, ${tier.opacity})`;

    const lines = cache.layoutLines;
    const lh = cache.lineHeightLayout;
    const n = lines.length;
    if (p.lineSlides.length !== n) continue;

    const reactsUmbrella = tierReactsToUmbrella(p.tierId);
    for (let i = 0; i < n; i++) {
      const line = lines[i] as LayoutLine;
      const slide = reactsUmbrella ? p.lineSlides[i] : 0;
      const lineY = p.y + i * lh;
      const lineBottom = lineY + lh;
      const roofX = p.x + slide + line.width * 0.5;
      const roofY = roofYAtX
        ? roofYAtX(roofX)
        : getRooflineY(cssHeight, cssWidth, roofX);
      if (tier.clipsToRoof && lineBottom > roofY) continue;
      ctx.fillText(line.text, p.x + slide, lineY);
    }
  }
}

export function drawUmbrella(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(35, 40, 48, 0.92)';
  ctx.fillStyle = 'rgba(245, 248, 252, 0.35)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, 22, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 36);
  ctx.stroke();
  ctx.restore();
}
