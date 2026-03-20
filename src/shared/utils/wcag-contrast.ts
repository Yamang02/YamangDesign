/**
 * WCAG 2.1 대비 비율(contrast ratio) 기준값.
 * {@link https://www.w3.org/TR/WCAG21/#contrast-minimum | WCAG 2.1 §1.4.3 Contrast (Minimum)}
 * {@link https://www.w3.org/TR/WCAG21/#dfn-large-scale | large-scale text 정의}
 *
 * 실제 UI에 적용할 때는 용도별로 다른 상수를 선택한다.
 * (예: 본문 → AA_NORMAL_TEXT, 액션 라벨 힌트 → AA_LARGE_TEXT)
 */
export const WCAG21_CONTRAST = {
  /** AA — 일반 텍스트 (대부분의 본문·캡션) */
  AA_NORMAL_TEXT: 4.5,
  /** AA — 대형 텍스트(약 18pt+ 일반 / 14pt+ 볼드에 해당) */
  AA_LARGE_TEXT: 3,
  /** AAA — 일반 텍스트 (향후 고대비 모드 등) */
  AAA_NORMAL_TEXT: 7,
  /** AAA — 대형 텍스트 */
  AAA_LARGE_TEXT: 4.5,
} as const;

export type Wcag21ContrastKey = keyof typeof WCAG21_CONTRAST;
