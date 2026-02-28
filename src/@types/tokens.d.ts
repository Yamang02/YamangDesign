/**
 * 외부에서 입력되는 색상 팔레트
 * 배색 이론 기반: Primary, Secondary, Accent, Sub
 */
export interface ExternalPalette {
  /** 주조색 - 필수. 브랜드/주요 액션 컬러 */
  primary: string;

  /** 보조색 - 선택. Primary와 조화를 이루는 보조 컬러 */
  secondary?: string;

  /** 강조색 - 선택. 주의 환기, 하이라이트용 */
  accent?: string;

  /** 서브컬러 - 선택. 배경, 중립 요소용 */
  sub?: string;
}

/**
 * 파생 처리 완료된 팔레트
 * 항상 4개 색상이 존재함을 보장
 */
export interface ResolvedPalette {
  primary: string;
  secondary: string;
  accent: string;
  sub: string;

  /** 메타 정보: 어떤 색상이 파생인지 추적 */
  _meta: {
    derived: {
      secondary: boolean;
      accent: boolean;
      sub: boolean;
    };
  };
}

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
 * 생성된 색상 스케일 모음
 */
export interface GeneratedScales {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  sub: ColorScale;
}
