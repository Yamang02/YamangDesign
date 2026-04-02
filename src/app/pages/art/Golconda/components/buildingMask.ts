/**
 * E28: Golconda_bg — 하늘↔건물 경계(지붕선) y. 이미지 스캔 LUT 우선, 없으면 구간 근사.
 */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * 스캔/해석으로 얻은 지붕선을 아래로 이동 (y 증가).
 * 너무 위에서 끊기면 값을 키운다.
 */
const ROOFLINE_SHIFT_DOWN_PX = 52;

function applyRooflineShiftDown(y: number, canvasH: number): number {
  return Math.min(canvasH, y + ROOFLINE_SHIFT_DOWN_PX);
}

/** x·canvas 비율 t ∈ [0,1]에 대한 지붕선 높이 비율 (캔버스 상단=0) — LUT 없을 때 폴백 */
function roofYRatio(t: number): number {
  if (t <= 0.18) return lerp(0.52, 0.5, t / 0.18);
  if (t <= 0.42) return lerp(0.5, 0.46, (t - 0.18) / 0.24);
  if (t <= 0.58) return lerp(0.46, 0.48, (t - 0.42) / 0.16);
  if (t <= 0.78) return lerp(0.48, 0.54, (t - 0.58) / 0.2);
  return lerp(0.54, 0.56, (t - 0.78) / 0.22);
}

export function getRooflineY(canvasH: number, canvasW: number, x: number): number {
  const w = Math.max(canvasW, 1);
  const t = Math.min(1, Math.max(0, x / w));
  return applyRooflineShiftDown(roofYRatio(t) * canvasH, canvasH);
}

/** 상단 스트립 평균색과의 거리²가 이 값을 넘으면 “하늘 아님”으로 첫 지붕/벽 픽셀 */
const SKY_DIST_SQ = 52 * 52;

/**
 * 배경을 w×h에 그린 뒤 열마다 위→아래로 스캔해 첫 비-하늘 픽셀의 y.
 * 브라우저 전용 (OffscreenCanvas + getImageData).
 */
export function scanRooflineYTable(
  image: CanvasImageSource,
  width: number,
  height: number,
): Float32Array {
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext('2d', { willReadFrequently: true });
  if (!c) {
    return fallbackTable(w, h);
  }
  c.drawImage(image, 0, 0, w, h);
  let imageData: ImageData;
  try {
    imageData = c.getImageData(0, 0, w, h);
  } catch {
    return fallbackTable(w, h);
  }
  const { data } = imageData;

  const topH = Math.max(1, Math.floor(h * 0.08));
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let cnt = 0;
  for (let y = 0; y < topH; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      sr += data[i];
      sg += data[i + 1];
      sb += data[i + 2];
      cnt++;
    }
  }
  sr /= cnt;
  sg /= cnt;
  sb /= cnt;

  const raw = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    let roofY = h * 0.52;
    let found = false;
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dr = r - sr;
      const dg = g - sg;
      const db = b - sb;
      const distSq = dr * dr + dg * dg + db * db;
      if (distSq > SKY_DIST_SQ) {
        roofY = y;
        found = true;
        break;
      }
    }
    raw[x] = found ? roofY : h * 0.5;
  }

  return boxBlur1D(raw, Math.min(4, Math.floor(w / 120) + 2));
}

/** 보정 전 y만 저장 — `getRooflineYFromTable`에서 `applyRooflineShiftDown` 한 번 적용 */
function fallbackTable(w: number, h: number): Float32Array {
  const t = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    const ratio = roofYRatio(Math.min(1, Math.max(0, (x + 0.5) / Math.max(w, 1))));
    t[x] = ratio * h;
  }
  return t;
}

function boxBlur1D(src: Float32Array, radius: number): Float32Array {
  if (radius < 1) return src;
  const w = src.length;
  const out = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    let sum = 0;
    let n = 0;
    for (let dx = -radius; dx <= radius; dx++) {
      const xx = Math.min(w - 1, Math.max(0, x + dx));
      sum += src[xx];
      n++;
    }
    out[x] = sum / n;
  }
  return out;
}

/** LUT 기준 roof Y; 테이블 없거나 길이 불일치 시 해석 근사 */
export function getRooflineYFromTable(
  table: Float32Array | null,
  canvasH: number,
  canvasW: number,
  x: number,
): number {
  const w = Math.max(1, Math.floor(canvasW));
  if (!table || table.length !== w) {
    return getRooflineY(canvasH, canvasW, x);
  }
  const xf = Math.min(w - 1, Math.max(0, x));
  const x0 = Math.floor(xf);
  const x1 = Math.min(w - 1, x0 + 1);
  const tt = xf - x0;
  const y = table[x0] * (1 - tt) + table[x1] * tt;
  return applyRooflineShiftDown(y, canvasH);
}
