/**
 * E06: Site Style - 이 디자인시스템의 스타일 선호 설정
 */

export const siteStyle = {
  /** UI 밀도 — TODO(P05): 실제 사용처 없음. 향후 레이아웃 시스템에서 활용 예정 */
  uiDensity: 'minimal' as const,

  /** 가이드/도움말 스타일 (Tooltip.tsx에서 tooltipDelay 사용) */
  guidance: {
    default: 'tooltip' as const,
    tooltipDelay: 300,
    allowInlineForComplex: true,
  },

  /** 기본 테마 설정 */
  defaults: {
    palette: 'default' as const,
    style: 'minimal' as const,
    bgStrategy: 'light' as const,
  },

  /** 레이아웃 — TODO(P05): 실제 사용처 없음. 향후 레이아웃 시스템에서 활용 예정 */
  layout: {
    maxContentWidth: '75rem',
    spacingScale: 'normal' as const,
  },

  /** 상호작용 — TODO(P05): 실제 사용처 없음. 향후 애니메이션/포커스 시스템에서 활용 예정 */
  interaction: {
    animation: 'subtle' as const,
    focusIndicator: 'ring' as const,
  },
} as const;

export type SiteStyle = typeof siteStyle;
