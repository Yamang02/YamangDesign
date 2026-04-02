/**
 * E28: 신사 티어 — 실루엣 크기·마이크로 글자 크기·낙하 속도 (상수로 조정 가능)
 */
export type GentlemanTier = {
  id: string
  /** 실루엣 경계 박스 (px) */
  cellW: number
  cellH: number
  /** 실루엣을 채우는 글자 크기 (px) */
  microFontPx: number
  speed: number
  opacity: number
  /** XS·S만 지붕선 아래 행 스킵 */
  clipsToRoof: boolean
}

export const GENTLEMAN_TIERS: GentlemanTier[] = [
  {
    id: 'xs',
    cellW: 30,
    cellH: 56,
    microFontPx: 4,
    speed: 0.45,
    opacity: 0.52,
    clipsToRoof: true,
  },
  {
    id: 's',
    cellW: 40,
    cellH: 70,
    microFontPx: 5,
    speed: 0.65,
    opacity: 0.64,
    clipsToRoof: true,
  },
  {
    id: 'm',
    cellW: 52,
    cellH: 88,
    microFontPx: 6,
    speed: 0.9,
    opacity: 0.78,
    clipsToRoof: false,
  },
  {
    id: 'l',
    cellW: 64,
    cellH: 108,
    microFontPx: 7,
    speed: 1.12,
    opacity: 0.9,
    clipsToRoof: false,
  },
];

export function tierById(id: string): GentlemanTier | undefined {
  return GENTLEMAN_TIERS.find((t) => t.id === id);
}
