/**
 * Palette 레이어 타입 정의
 * E01: 배색을 독립 레이어로 관리
 */

import type { ExternalPalette, GeneratedScales } from '../@types/tokens';

// ============================================================================
// PaletteSelection: 팔레트 선택 의도를 명시하는 단일 타입
// ============================================================================

/**
 * 팔레트 선택 상태 (discriminated union)
 *
 * 기존 paletteName + customColors 조합을 단일 타입으로 통합.
 * 선택 의도가 타입에 명시되어 잘못된 조합을 컴파일 타임에 방지.
 *
 * @example
 * // 프리셋 선택
 * { type: 'preset', presetId: 'default-spring-cream' }
 *
 * // 사용자 직접 색상 입력
 * { type: 'custom', colors: { primary: '#6366F1', ... } }
 *
 * // 커스텀 시맨틱 프리셋 (베이스 + 오버라이드)
 * { type: 'custom-semantic', presetId: 'custom-semantic-abc123' }
 */
export type PaletteSelection =
  | { type: 'preset'; presetId: string }
  | { type: 'custom'; colors: ExternalPalette }
  | { type: 'custom-semantic'; presetId: string };

// PaletteName은 constants/theme-presets.ts에서 정의됨
// PaletteDefinition.name은 내부 유연성을 위해 string 유지

/** 배경 전략 */
export type BgStrategy = 'light' | 'colored' | 'dark';

/** 테마 카테고리 */
export type ThemeCategory =
  | 'default'
  | 'custom'
  | 'natural'
  | 'pop';

/** 테마 메타데이터 */
export interface ThemeMetadata {
  /** 테마 ID (고유 키) */
  id: string;
  /** 표시 이름 */
  displayName: string;
  /** 카테고리 */
  category: ThemeCategory;
  /** 설명 */
  description?: string;
}

/** 스케일 참조 (예: primary-500, neutral-900) */
export interface ScaleReference {
  scale: 'primary' | 'secondary' | 'accent' | 'neutral' | 'sub';
  step: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

/** 시맨틱 토큰 매핑 정의 (ScaleReference 또는 직접 색상) */
export interface SemanticMapping {
  bg: {
    base: string | ScaleReference;
    surface: string | ScaleReference;
    surfaceBrand: string | ScaleReference;
    elevated: string | ScaleReference;
    muted: string | ScaleReference;
  };
  text: {
    primary: string | ScaleReference;
    secondary: string | ScaleReference;
    muted: string | ScaleReference;
    onAction: string | ScaleReference;
  };
  border: {
    default: string | ScaleReference;
    subtle: string | ScaleReference;
    accent: string | ScaleReference;
    focus: string | ScaleReference;
  };
}

/** 시맨틱 색상 (배경 전략에서 생성) */
export interface SemanticColors {
  bg: {
    base: string;
    surface: string;
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
}

/** Palette 정의 (프리셋 또는 사용자 정의) */
export interface PaletteDefinition {
  name: string;

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

  /** 대비 설정 */
  contrast?: 'normal' | 'high';

  /** 테마 메타데이터 (선택적, 카테고리/검색용) */
  metadata?: ThemeMetadata;

  /** 시맨틱 매핑 (선택적, 없으면 bgStrategy 기본값 사용) */
  semanticMapping?: SemanticMapping;
}

/** 확장된 Palette (스케일 + 시맨틱 포함, createPalette 반환값) */
export interface ExpandedPalette {
  name: string;
  bgStrategy: BgStrategy;

  /** 색상 스케일 */
  scales: GeneratedScales;

  /** 시맨틱 색상 (배경, 텍스트, 경계선) */
  semantic: SemanticColors;
}
