/**
 * Palette 레이어 타입 정의
 * E01: 배색을 독립 레이어로 관리
 */

import type { GeneratedScales } from '../@types/tokens';

/** 배색 프리셋 이름 */
export type PaletteName =
  | 'default'
  | 'vivid'
  | 'pastel'
  | 'monochrome'
  | 'earth'
  | 'custom';

/** 배경 전략 */
export type BgStrategy = 'light' | 'colored' | 'dark';

/** 시맨틱 색상 (배경 전략에서 생성) */
export interface SemanticColors {
  bg: {
    base: string;
    surface: string;
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
    focus: string;
  };
}

/** Palette 정의 (프리셋 또는 사용자 정의) */
export interface PaletteDefinition {
  name: PaletteName;

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
}

/** 확장된 Palette (스케일 + 시맨틱 포함, createPalette 반환값) */
export interface ExpandedPalette {
  name: PaletteName;
  bgStrategy: BgStrategy;

  /** 색상 스케일 */
  scales: GeneratedScales;

  /** 시맨틱 색상 (배경, 텍스트, 경계선) */
  semantic: SemanticColors;
}
