/**
 * P04: 시맨틱 토큰별 스케일/스텝 추천
 * 배경 전략에 따른 적합한 매핑 판별
 */
import type { BgStrategy, ScaleReference } from '../types';

export type RecommendationLevel = 'recommended' | 'warning' | 'neutral';

/** SemanticMapping 내부 키 경로 (편집 가능한 토큰만) */
export type SemanticTokenPath =
  | 'bg.base'
  | 'bg.surface'
  | 'bg.surfaceBrand'
  | 'bg.elevated'
  | 'bg.muted'
  | 'text.primary'
  | 'text.secondary'
  | 'text.muted'
  | 'text.onAction'
  | 'border.default'
  | 'border.subtle'
  | 'border.accent'
  | 'border.focus';

export interface RecommendationResult {
  level: RecommendationLevel;
  message?: string;
}

/**
 * 토큰 + 스케일/스텝 + bgStrategy 기반 추천 레벨 반환
 */
export function getScaleRecommendation(
  semanticToken: SemanticTokenPath,
  scale: ScaleReference['scale'],
  step: ScaleReference['step'],
  bgStrategy: BgStrategy
): RecommendationResult {
  if (bgStrategy === 'light') {
    if (semanticToken.startsWith('text.')) {
      if (step >= 600 && (scale === 'neutral' || scale === 'sub')) {
        return { level: 'recommended', message: '본문 텍스트에 적합' };
      }
      if (step <= 300 && scale === 'neutral') {
        return { level: 'warning', message: '밝은 배경에서 가독성 낮을 수 있음' };
      }
    }
    if (semanticToken.startsWith('bg.')) {
      if (step <= 200 && (scale === 'neutral' || scale === 'primary')) {
        return { level: 'recommended', message: '밝은 배경에 적합' };
      }
      if (step >= 700) {
        return { level: 'warning', message: '어두운 배경은 light 전략에 부적합할 수 있음' };
      }
    }
    if (semanticToken.startsWith('border.')) {
      if (step <= 400) return { level: 'recommended', message: '밝은 테두리에 적합' };
    }
  }

  if (bgStrategy === 'dark') {
    if (semanticToken.startsWith('text.')) {
      if (step <= 400 && (scale === 'neutral' || scale === 'sub')) {
        return { level: 'recommended', message: '어두운 배경 위 텍스트에 적합' };
      }
      if (step >= 700 && scale === 'neutral') {
        return { level: 'warning', message: '어두운 배경에서 가독성 낮을 수 있음' };
      }
    }
    if (semanticToken.startsWith('bg.')) {
      if (step >= 600) return { level: 'recommended', message: '어두운 배경에 적합' };
      if (step <= 300) {
        return { level: 'warning', message: '밝은 배경은 dark 전략에 부적합할 수 있음' };
      }
    }
    if (semanticToken.startsWith('border.')) {
      if (step >= 500) return { level: 'recommended', message: '어두운 테두리에 적합' };
    }
  }

  if (bgStrategy === 'colored') {
    if (semanticToken.startsWith('text.')) {
      if (step >= 500 && step <= 900) return { level: 'recommended' };
    }
    if (semanticToken.startsWith('bg.')) {
      if (step >= 100 && step <= 400) return { level: 'recommended' };
    }
  }

  return { level: 'neutral' };
}
