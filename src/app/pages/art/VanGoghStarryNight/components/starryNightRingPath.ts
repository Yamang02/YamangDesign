/**
 * Canvas 링·CSS clip-path 공유 — 물결 외곽 + 안쪽 라운드 사각 (evenodd)
 */
export type CanvasMotionPreference = 'system' | 'full' | 'reduced';

export const STARRY_RING_WAVES = 2.35;
export const DEFAULT_PAD_X = 44;
export const DEFAULT_PAD_Y = 36;

export function readPaddingPx(el: HTMLElement): { padX: number; padY: number } {
  const cs = getComputedStyle(el);
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

export function computeWaveAmplitude(
  W: number,
  H: number,
  motionPreference: CanvasMotionPreference
): { reduce: boolean; waveAmp: number } {
  const systemReduce =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduce =
    motionPreference === 'reduced' ||
    (motionPreference === 'system' && systemReduce);
  const baseAmp = Math.min(5, Math.min(W, H) * 0.013);
  const waveAmp = reduce ? 0 : baseAmp;
  return { reduce, waveAmp };
}

/** Canvas `arc(..., anticlockwise)` 와 동일한 방향으로 각 보간 */
function appendCanvasArcTessellated(
  parts: string[],
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
  anticlockwise: boolean,
  segments: number
): void {
  const twoPi = 2 * Math.PI;
  let delta = end - start;
  if (!anticlockwise) {
    if (delta < 0) delta += twoPi;
  } else {
    if (delta > 0) delta -= twoPi;
  }
  for (let s = 1; s <= segments; s++) {
    const t = s / segments;
    const ang = start + delta * t;
    parts.push(`L ${cx + r * Math.cos(ang)} ${cy + r * Math.sin(ang)}`);
  }
}

/** Canvas `traceOuterWavyPath` 와 동일한 형상 → SVG path d (단일 닫힌 경로) */
export function buildOuterWavyPathData(
  W: number,
  H: number,
  r: number,
  amp: number,
  waves: number
): string {
  const spanX = W - 2 * r;
  const spanY = H - 2 * r;
  const steps = Math.max(28, Math.floor(Math.min(W, H) / 10));
  const arcSeg = 10;
  const parts: string[] = [];

  parts.push(`M 0 ${r}`);
  appendCanvasArcTessellated(parts, r, r, r, Math.PI, -Math.PI / 2, false, arcSeg);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = r + t * spanX;
    const taper = Math.sin(Math.PI * t);
    const y = taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t));
    parts.push(`L ${x} ${y}`);
  }

  appendCanvasArcTessellated(parts, W - r, r, r, -Math.PI / 2, 0, false, arcSeg);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = r + t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = W - taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 1.1));
    parts.push(`L ${x} ${y}`);
  }

  appendCanvasArcTessellated(parts, W - r, H - r, r, 0, Math.PI / 2, false, arcSeg);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = W - r - t * spanX;
    const taper = Math.sin(Math.PI * t);
    const y = H - taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 2.2));
    parts.push(`L ${x} ${y}`);
  }

  appendCanvasArcTessellated(parts, r, H - r, r, Math.PI / 2, Math.PI, false, arcSeg);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = H - r - t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 3.3));
    parts.push(`L ${x} ${y}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

function buildInnerRoundedRectPathData(x: number, y: number, w: number, h: number, rad: number): string {
  const cornerR = Math.min(rad, w / 2, h / 2);
  if (w <= 0 || h <= 0) return '';
  return [
    `M ${x + cornerR} ${y}`,
    `L ${x + w - cornerR} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + cornerR}`,
    `L ${x + w} ${y + h - cornerR}`,
    `Q ${x + w} ${y + h} ${x + w - cornerR} ${y + h}`,
    `L ${x + cornerR} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - cornerR}`,
    `L ${x} ${y + cornerR}`,
    `Q ${x} ${y} ${x + cornerR} ${y}`,
    'Z',
  ].join(' ');
}

/** `clip-path: path(evenodd, '…')` 용 — 링 영역(외곽 물결 − 안쪽 라운드 사각) */
export function buildCanvasRingClipPathData(
  W: number,
  H: number,
  padX: number,
  padY: number,
  waveAmp: number
): string | null {
  const iw = W - 2 * padX;
  const ih = H - 2 * padY;
  if (iw <= 1 || ih <= 1) return null;

  const r = Math.min(12, Math.min(W, H) * 0.035);
  const innerR = Math.max(2, r * 0.55);
  const outer = buildOuterWavyPathData(W, H, r, waveAmp, STARRY_RING_WAVES);
  const inner = buildInnerRoundedRectPathData(padX, padY, iw, ih, innerR);
  return `${outer} ${inner}`;
}

export function traceOuterWavyPath(
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
    const y = taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t));
    ctx.lineTo(x, y);
  }

  ctx.arc(W - r, r, r, -Math.PI / 2, 0, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = r + t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = W - taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 1.1));
    ctx.lineTo(x, y);
  }

  ctx.arc(W - r, H - r, r, 0, Math.PI / 2, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = W - r - t * spanX;
    const taper = Math.sin(Math.PI * t);
    const y = H - taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 2.2));
    ctx.lineTo(x, y);
  }

  ctx.arc(r, H - r, r, Math.PI / 2, Math.PI, false);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = H - r - t * spanY;
    const taper = Math.sin(Math.PI * t);
    const x = taper * amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * waves * t + 3.3));
    ctx.lineTo(x, y);
  }

  ctx.closePath();
}

export function traceInnerRoundedRectPath(
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
