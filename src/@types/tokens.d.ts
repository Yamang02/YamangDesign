/**
 * 외부에서 입력되는 색상 팔레트
 * E09: Neutral(무채색) / Sub(컬러풀 보조색) 분리
 */
export interface ExternalPalette {
  /** 주조색 - 필수. 브랜드/주요 액션 컬러 */
  primary: string;

  /** 보조색 - 선택. Primary와 조화를 이루는 보조 컬러 */
  secondary?: string;

  /** 강조색 - 선택. 주의 환기, 하이라이트용 */
  accent?: string;

  /** Neutral(무채색). 텍스트/테두리/배경용. 미입력 시 sub 또는 고정 gray */
  neutral?: string;

  /** Sub(컬러풀 보조색). 지정된 영역에만 사용. E09 적용 정책 참고 */
  sub?: string;
}

/**
 * 해석 완료된 팔레트 색상 (E09: neutral 추가, sub 선택적)
 */
export interface ResolvedColors {
  primary: string;
  secondary: string;
  accent: string;
  /** Neutral - 항상 존재. 텍스트/테두리/배경용 */
  neutral: string;
  /** Sub - 선택적. 컬러풀 보조색 */
  sub?: string;

  /** 메타 정보: 어떤 색상이 파생인지 추적 */
  _meta: {
    derived: {
      secondary: boolean;
      accent: boolean;
      neutral: boolean;
      sub: boolean;
    };
  };
}

/** @deprecated E01: ResolvedColors로 마이그레이션 */
export type ResolvedPalette = ResolvedColors;

/**
 * 색상 스케일 (10단계)
 */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * 생성된 색상 스케일 모음 (E09: neutral 추가, sub 선택적)
 */
export interface GeneratedScales {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  /** Neutral - 항상 존재. 텍스트/테두리/배경용 */
  neutral: ColorScale;
  /** Sub - sub 입력 시에만 존재. 컬러풀 보조색 */
  sub?: ColorScale;
}
