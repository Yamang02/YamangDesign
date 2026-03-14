/**
 * 구조화가 필요한 CSS 값 처리 (Figma/Sketch 스타일)
 * box-shadow, border, transition 등 토큰명/값에 따라 구조화 표기로 변환
 */

/** box-shadow 한 레이어 */
export interface BoxShadowLayer {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  inset?: boolean;
}

/** border shorthand */
export interface BorderStructured {
  width: string;
  style: string;
  color: string;
}

/** transition shorthand (property duration timing delay) */
export interface TransitionStructured {
  property: string;
  duration: string;
  timing: string;
  delay: string;
}

// --- box-shadow ---
function parseBoxShadowLayer(layerStr: string): BoxShadowLayer | null {
  const s = layerStr.trim();
  if (!s) return null;
  let rest = s;
  const inset = rest.startsWith('inset');
  if (inset) rest = rest.slice(5).trim();
  const lengths: string[] = [];
  let idx = 0;
  const lengthAtStart = /^-?[\d.]+(?:px|em|rem|%)?\s*/;
  while (lengths.length < 4) {
    const part = rest.slice(idx);
    const m = part.match(lengthAtStart);
    if (!m) break;
    lengths.push(m[0].trim());
    idx += m[0].length;
  }
  const colorPart = rest.slice(idx).trim();
  if (lengths.length < 2) return null;
  return {
    x: lengths[0],
    y: lengths[1],
    blur: lengths[2] ?? '0',
    spread: lengths[3] ?? '0',
    color: colorPart || 'transparent',
    inset: inset || undefined,
  };
}

function parseBoxShadow(css: string): BoxShadowLayer[] {
  const s = css.trim();
  if (!s || s.toLowerCase() === 'none') return [];
  const layers: BoxShadowLayer[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === ',' && depth === 0) {
      const layer = parseBoxShadowLayer(s.slice(start, i).trim());
      if (layer) layers.push(layer);
      start = i + 1;
    }
  }
  const layer = parseBoxShadowLayer(s.slice(start).trim());
  if (layer) layers.push(layer);
  return layers;
}

function formatBoxShadowDisplay(css: string, fallbackRaw?: string): string {
  const layers = parseBoxShadow(css);
  if (layers.length === 0) return fallbackRaw && fallbackRaw.trim() ? fallbackRaw.trim() : 'none';
  const one = (l: BoxShadowLayer, indent = '') =>
    [
      l.inset ? 'Inset' : null,
      `X: ${l.x}`,
      `Y: ${l.y}`,
      `Blur: ${l.blur}`,
      `Spread: ${l.spread}`,
      `Color: ${l.color}`,
    ]
      .filter(Boolean)
      .map((s) => indent + s)
      .join('\n');
  if (layers.length === 1) return one(layers[0]);
  return layers.map((l, i) => `Layer ${i + 1}:\n${one(l, '  ')}`).join('\n\n');
}

// --- border (width style color) ---
function parseBorder(value: string): BorderStructured | null {
  const s = value.trim();
  if (!s) return null;
  const parts = s.split(/\s+/);
  if (parts.length < 2) return null;
  const width = parts[0];
  const style = parts[1];
  const color = parts.slice(2).join(' ') || 'currentColor';
  return { width, style, color };
}

function formatBorderDisplay(value: string): string {
  const b = parseBorder(value);
  if (!b) return value;
  return `Width: ${b.width}\nStyle: ${b.style}\nColor: ${b.color}`;
}

// --- transition ---
function parseTransition(value: string): TransitionStructured | null {
  const s = value.trim();
  if (!s || s === 'none') return null;
  const parts = s.split(/\s+/);
  if (parts.length < 2) return null;
  const [property, duration, timing, delay] = parts;
  return {
    property: property ?? 'all',
    duration: duration ?? '0s',
    timing: timing ?? 'ease',
    delay: delay ?? '0s',
  };
}

function formatTransitionDisplay(value: string): string {
  const t = parseTransition(value);
  if (!t) return value;
  return `Property: ${t.property}\nDuration: ${t.duration}\nTiming: ${t.timing}\nDelay: ${t.delay}`;
}

// --- 단일 진입점: 토큰명/값에 따라 구조화 표기 반환 ---
const SHADOW_LIKE = /shadow|focus-glow|focus-ring/;
const BORDER_LIKE = /border-(?:width|style|default|subtle|strong|hover|focus)/;
const TRANSITION_LIKE = /transition|duration|ease/;

/**
 * 구조화가 필요한 CSS 값이면 구조화 표기 문자열 반환, 아니면 원본 값 반환
 */
export function formatStructuredDisplay(token: string, value: string): string {
  if (!value || value === '(not set)') return value;
  const t = token.toLowerCase();
  const v = value.trim();
  if (SHADOW_LIKE.test(t) && (v.includes('px') || v.includes('rgba') || v.startsWith('0') || v === 'none')) {
    const formatted = formatBoxShadowDisplay(value, value);
    return formatted;
  }
  if (BORDER_LIKE.test(t) && /\s+(solid|none|dashed|dotted)\s+/.test(v)) {
    return formatBorderDisplay(value);
  }
  if (TRANSITION_LIKE.test(t) && /\s+\d+ms|\d+s\s+/.test(v)) {
    return formatTransitionDisplay(value);
  }
  return value;
}

/** box-shadow 전용: 파싱/직렬화가 필요한 경우 (편집 등) */
export { parseBoxShadow, parseBoxShadowLayer };
export function formatBoxShadow(layers: BoxShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers
    .map((l) => [l.inset ? 'inset' : '', l.x, l.y, l.blur, l.spread, l.color].filter(Boolean).join(' '))
    .join(', ');
}
