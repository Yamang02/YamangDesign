/**
 * P04: 시맨틱 토큰별 스케일/스텝 추천
 * 배경 전략에 따른 적합한 매핑 판별
 */
import type { BgStrategy, ScaleReference } from '../types';

export type RecommendationLevel = 'recommended' | 'warning' | 'neutral';

/** SemanticMapping 내부 키 경로 (편집 가능한 토큰만) */
export type SemanticTokenPath =
  | 'bg.base'
  | 'bg.subtle'
  | 'bg.surface'
  | 'bg.surfaceBrand'
  | 'bg.elevated'
  | 'bg.muted'
  | 'text.primary'
  | 'text.secondary'
  | 'text.muted'
  | 'border.default'
  | 'border.subtle'
  | 'border.accent'
  | 'border.focus';

export interface RecommendationResult {
  level: RecommendationLevel;
  message?: string;
}

type Rule = {
  bg: BgStrategy;
  prefix: string;
  match: (scale: ScaleReference['scale'], step: ScaleReference['step']) => boolean;
  result: RecommendationResult;
};

const RULES: Rule[] = [
  // light — text
  { bg: 'light', prefix: 'text.', match: (scale, step) => step >= 600 && (scale === 'neutral' || scale === 'sub'), result: { level: 'recommended', message: '본문 텍스트에 적합' } },
  { bg: 'light', prefix: 'text.', match: (scale, step) => step <= 300 && scale === 'neutral', result: { level: 'warning', message: '밝은 배경에서 가독성 낮을 수 있음' } },
  // light — bg
  { bg: 'light', prefix: 'bg.', match: (scale, step) => step <= 200 && (scale === 'neutral' || scale === 'primary'), result: { level: 'recommended', message: '밝은 배경에 적합' } },
  { bg: 'light', prefix: 'bg.', match: (_scale, step) => step >= 700, result: { level: 'warning', message: '어두운 배경은 light 전략에 부적합할 수 있음' } },
  // light — border
  { bg: 'light', prefix: 'border.', match: (_scale, step) => step <= 400, result: { level: 'recommended', message: '밝은 테두리에 적합' } },
  // dark — text
  { bg: 'dark', prefix: 'text.', match: (scale, step) => step <= 400 && (scale === 'neutral' || scale === 'sub'), result: { level: 'recommended', message: '어두운 배경 위 텍스트에 적합' } },
  { bg: 'dark', prefix: 'text.', match: (scale, step) => step >= 700 && scale === 'neutral', result: { level: 'warning', message: '어두운 배경에서 가독성 낮을 수 있음' } },
  // dark — bg
  { bg: 'dark', prefix: 'bg.', match: (_scale, step) => step >= 600, result: { level: 'recommended', message: '어두운 배경에 적합' } },
  { bg: 'dark', prefix: 'bg.', match: (_scale, step) => step <= 300, result: { level: 'warning', message: '밝은 배경은 dark 전략에 부적합할 수 있음' } },
  // dark — border
  { bg: 'dark', prefix: 'border.', match: (_scale, step) => step >= 500, result: { level: 'recommended', message: '어두운 테두리에 적합' } },
  // colored — text
  { bg: 'colored', prefix: 'text.', match: (_scale, step) => step >= 500 && step <= 900, result: { level: 'recommended' } },
  // colored — bg
  { bg: 'colored', prefix: 'bg.', match: (_scale, step) => step >= 100 && step <= 400, result: { level: 'recommended' } },
];

/**
 * 토큰 + 스케일/스텝 + bgStrategy 기반 추천 레벨 반환
 */
export function getScaleRecommendation(
  semanticToken: SemanticTokenPath,
  scale: ScaleReference['scale'],
  step: ScaleReference['step'],
  bgStrategy: BgStrategy
): RecommendationResult {
  for (const rule of RULES) {
    if (rule.bg !== bgStrategy) continue;
    if (!semanticToken.startsWith(rule.prefix)) continue;
    if (rule.match(scale, step)) return rule.result;
  }
  return { level: 'neutral' };
}
