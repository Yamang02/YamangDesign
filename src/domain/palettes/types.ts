/**
 * Palette 레이어 타입 정의
 * E01: 배색을 독립 레이어로 관리
 */

import type { GeneratedScales } from '@shared/@types/tokens';
import type { StyleName } from '@shared/@types/theme';

// PaletteSelection은 E11 P03에서 state/ 레이어로 이동됨
// 하위 호환을 위해 re-export 유지
export type { PaletteSelection } from '@app/state/types';

// PaletteName은 constants/theme-presets.ts에서 정의됨
// PaletteDefinition.name은 내부 유연성을 위해 string 유지

/** 배경 전략 */
export type BgStrategy = 'light' | 'colored' | 'dark';

/** 테마 카테고리 */
export type ThemeCategory =
  | 'default'
  | 'custom'
  | 'natural'
  | 'pop'
  | 'historical';

/** 스케일 참조 (예: primary-500, neutral-900) */
export interface ScaleReference {
  scale: 'primary' | 'secondary' | 'accent' | 'neutral' | 'sub';
  step: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

/** 두 스케일 값을 비율로 혼합하는 참조 */
export interface MixReference {
  base: ScaleReference;
  mix: ScaleReference;
  ratio: number;
}

export type SemanticMappingValue = string | ScaleReference | MixReference;

/** 시맨틱 토큰 매핑 정의 (ScaleReference 또는 직접 색상) */
export interface SemanticMapping {
  bg: {
    base: SemanticMappingValue;
    subtle: SemanticMappingValue;
    surfaceLow: SemanticMappingValue;
    surface: SemanticMappingValue;
    surfaceHigh: SemanticMappingValue;
    surfaceBrand: SemanticMappingValue;
    elevated: SemanticMappingValue;
    muted: SemanticMappingValue;
  };
  text: {
    primary: SemanticMappingValue;
    secondary: SemanticMappingValue;
    muted: SemanticMappingValue;
    onAction: SemanticMappingValue;
  };
  border: {
    default: SemanticMappingValue;
    subtle: SemanticMappingValue;
    accent: SemanticMappingValue;
    focus: SemanticMappingValue;
  };

  // E02: 액션 색상 (버튼 등 상태별)
  action: {
    primary: {
      default: SemanticMappingValue;
      hover: SemanticMappingValue;
      active: SemanticMappingValue;
    };
    secondary: {
      default: SemanticMappingValue;
      hover: SemanticMappingValue;
      active: SemanticMappingValue;
    };
    accent: {
      default: SemanticMappingValue;
      hover: SemanticMappingValue;
      active: SemanticMappingValue;
    };
  };

  // E02: 피드백 색상 (system-colors 대체)
  feedback: {
    error: {
      bg: SemanticMappingValue;
      text: SemanticMappingValue;
      border: SemanticMappingValue;
    };
    warning: {
      bg: SemanticMappingValue;
      text: SemanticMappingValue;
      border: SemanticMappingValue;
    };
    success: {
      bg: SemanticMappingValue;
      text: SemanticMappingValue;
      border: SemanticMappingValue;
    };
    info: {
      bg: SemanticMappingValue;
      text: SemanticMappingValue;
      border: SemanticMappingValue;
    };
  };
}

/** 시맨틱 색상 (배경 전략에서 생성) */
export interface SemanticColors {
  bg: {
    base: string;
    subtle: string;
    surfaceLow: string;
    surface: string;
    surfaceHigh: string;
    surfaceBrand: string;
    elevated: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onAction: string;
  };
  border: {
    default: string;
    subtle: string;
    accent: string;
    focus: string;
  };
  action: {
    primary: {
      default: string;
      hover: string;
      active: string;
    };
    secondary: {
      default: string;
      hover: string;
      active: string;
    };
    accent: {
      default: string;
      hover: string;
      active: string;
    };
  };
  feedback: {
    error: { bg: string; text: string; border: string };
    warning: { bg: string; text: string; border: string };
    success: { bg: string; text: string; border: string };
    info: { bg: string; text: string; border: string };
  };
}

/** Palette 정의 (프리셋 또는 사용자 정의) */
export interface PaletteDefinition {
  /** 고유 ID. registry와 themePresets의 키로 사용 */
  id: string;

  /** 사람이 읽는 표시 이름 */
  displayName?: string;

  /** 팔레트 카테고리 */
  category?: ThemeCategory;

  /** 설명 */
  description?: string;

  /** 프리셋 서브네임 (설명) */
  subname?: string;

  /** 기본 색상 (사용자 입력 또는 프리셋). E09: neutral/sub 분리 */
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    /** Neutral(무채색). 텍스트/테두리/배경용 */
    neutral?: string;
    /** Sub(컬러풀 보조색). 지정된 영역에만 사용. 비워두면 미사용 */
    sub?: string;
  };

  /** 배경색 전략 */
  bgStrategy: BgStrategy;

  /** 이 팔레트가 잘 어울리는 스타일 목록 (추천용) */
  recommendedForStyles?: StyleName[];

  /** 대비 설정 */
  contrast?: 'normal' | 'high';

  /** 시맨틱 매핑 (선택적, 없으면 bgStrategy 기본값 사용. 부분만 제공 시 병합됨) */
  semanticMapping?: Partial<SemanticMapping>;
}

/** 계산된 Palette (스케일 + 시맨틱 포함, createPalette 반환값) */
export interface ComputedPalette {
  id: string;
  bgStrategy: BgStrategy;

  /** 색상 스케일 */
  scales: GeneratedScales;

  /** 시맨틱 색상 (배경, 텍스트, 경계선) */
  semantic: SemanticColors;
}
