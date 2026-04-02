/**
 * E28: 신사 실루엣(정규화 좌표 0…1) + 마이크로텍스트 격자 채우기
 * 백슬래시(U+005C) 미사용 — 로캘/폰트에서 ₩로 보이는 문제 회피
 * 격자 문자열 → @chenglou/pretext 로 줄·폭 측정 후 Canvas에 그림 (pre-wrap로 앞뒤 공백 유지)
 */
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import type { LayoutLine } from '@chenglou/pretext';

const FILL_PATTERN = 'magritte·•·:';

/** 격자 밀도 — 낮을수록 같은 면적에 열·행이 많아짐 (Courier 대략 폭≈0.6em, 촘촘히 채우려면 0.45~0.52) */
const CHAR_W_RATIO = 0.48;
/** 줄 간격 — 글자 크기에 가깝게 두면 세로로 더 촘촘 (Pretext·Canvas 동일 값 사용) */
const LINE_HEIGHT_RATIO = 0.9;

/** (nx, ny) ∈ [0,1]² — 앞모습 코트 실루엣 근사 */
export function insideSilhouette(nx: number, ny: number): boolean {
  const x = nx;
  const y = ny;
  // 머리
  const hx = (x - 0.5) / 0.13;
  const hy = (y - 0.105) / 0.095;
  if (hx * hx + hy * hy <= 1) return true;
  // 상체·코트 (어깨→허리로 살짝 좁아짐)
  if (y >= 0.19 && y <= 0.55) {
    const t = (y - 0.19) / 0.36;
    const halfW = 0.22 * (1 - t * 0.28);
    if (Math.abs(x - 0.5) <= halfW) return true;
  }
  // 다리 두 기둥
  if (y > 0.55 && y < 0.94) {
    if (x >= 0.33 && x <= 0.47) return true;
    if (x >= 0.53 && x <= 0.67) return true;
  }
  return false;
}

export type MicrotextSilhouette = {
  lines: string[]
  lineHeight: number
  layoutHeight: number
  maxLineWidth: number
}

/** 실루엣 bbox(px) 안을 마이크로 문자로 채운 행 배열 */
export function buildMicrotextSilhouette(
  cellW: number,
  cellH: number,
  microFontPx: number,
): MicrotextSilhouette {
  const lineHeight = microFontPx * LINE_HEIGHT_RATIO;
  const charW = microFontPx * CHAR_W_RATIO;
  const cols = Math.max(18, Math.floor(cellW / charW));
  const rows = Math.max(28, Math.floor(cellH / lineHeight));

  const lines: string[] = [];
  let maxChars = 0;
  for (let r = 0; r < rows; r++) {
    let row = '';
    for (let c = 0; c < cols; c++) {
      const nx = (c + 0.5) / cols;
      const ny = (r + 0.5) / rows;
      if (insideSilhouette(nx, ny)) {
        row += FILL_PATTERN[(r * 31 + c * 11) % FILL_PATTERN.length];
      } else {
        row += ' ';
      }
    }
    lines.push(row);
    const trimmed = row.trimEnd();
    maxChars = Math.max(maxChars, trimmed.length);
  }

  const maxLineWidth = maxChars * charW;
  const layoutHeight = rows * lineHeight;

  return {
    lines,
    lineHeight,
    layoutHeight,
    maxLineWidth,
  };
}

export type LaidOutSilhouette = {
  layoutLines: LayoutLine[]
  lineHeight: number
  layoutHeight: number
  maxLineWidth: number
}

/** 격자 텍스트 블록을 Pretext로 측정 — 지붕선 스킵·우산 히트박스에 동일한 줄 높이·폭 사용 */
export function layoutMicrotextWithPretext(
  sil: MicrotextSilhouette,
  font: string,
): LaidOutSilhouette {
  const block = sil.lines.join('\n');
  const prepared = prepareWithSegments(block, font, { whiteSpace: 'pre-wrap' });
  const layout = layoutWithLines(prepared, 65536, sil.lineHeight);
  const maxLineWidth =
    layout.lines.length === 0 ? 0 : Math.max(...layout.lines.map((line) => line.width));
  return {
    layoutLines: layout.lines,
    lineHeight: sil.lineHeight,
    layoutHeight: layout.height,
    maxLineWidth,
  };
}
