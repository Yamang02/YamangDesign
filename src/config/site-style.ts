/**
 * E06: Site Style - 이 디자인시스템의 스타일 선호 설정
 */

export const siteStyle = {
  /** UI 밀도 */
  uiDensity: 'minimal' as const,

  /** 가이드/도움말 스타일 */
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

  /** 레이아웃 */
  layout: {
    maxContentWidth: '1200px',
    spacingScale: 'normal' as const,
  },

  /** 상호작용 */
  interaction: {
    animation: 'subtle' as const,
    focusIndicator: 'ring' as const,
  },
} as const;

export type SiteStyle = typeof siteStyle;
