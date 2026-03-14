/**
 * Style 레이어 타입 정의
 * E02: GUI 스타일(그림자, 테두리)을 독립 레이어로 관리
 * E02 P01: elevation/stroke 재명명, material/filter/spatial/createVars 슬롯 추가
 */

/** 스타일 프리셋 이름 (E06 P02: glassmorphism 추가) */
export type StyleName =
  | 'minimal'
  | 'neumorphism'
  | 'brutalism'
  | 'glassmorphism';

/**
 * 기존 코드의 shadow 키(none/sm/md/lg/xl/inset)를 의미 기반 레벨로 재명명.
 * 기존 키와 1:1 대응: none→0, sm→1, md→2, lg→3, xl→4, inset→inset
 * P02에서 createStyle이 { none, sm, md, lg, xl, inset } 형태의 하위 호환 매핑을 제공.
 */
export interface ElevationScale {
  0: string; // none (그림자 없음)
  1: string; // sm
  2: string; // md
  3: string; // lg
  4: string; // xl
  inset: string;
}

export interface StyleDefinition {
  name: StyleName;

  /** 깊이감 / 부유감 (기존 createShadows → elevation 재명명) */
  elevation: {
    create: (context: { bgColor: string }) => ElevationScale;
  };

  /** 경계선 처리 (기존 border → stroke 재명명) */
  stroke: {
    width: string;
    style: string;
    colorStrategy: 'palette' | 'transparent' | 'fixed';
    image?: string; // border-image
    fixedColor?: string; // colorStrategy === 'fixed' 일 때
  };

  /** 표면 재질: 투명도, 블러, 텍스처 */
  material?: {
    backdropFilter?: string; // 'blur(12px)'
    backgroundAlpha?: number; // 0 ~ 1 (배경 투명도)
    backgroundImage?: string; // 'url(texture.png)'
    backgroundBlendMode?: string; // 'multiply'
  };

  /** CSS filter 효과 */
  filter?: {
    element?: string; // 'saturate(0.8) contrast(1.1) sepia(0.2)'
  };

  /** 3D / 공간 효과 */
  spatial?: {
    perspective?: string; // '800px'
    transformStyle?: string; // 'preserve-3d'
  };

  /**
   * Escape hatch: 위 슬롯으로 표현 불가한 임의의 CSS 변수.
   * 변수명은 --ds- 접두사 사용을 권장하지만 강제하지 않음.
   */
  createVars?: (context: { bgColor: string }) => Record<string, string>;
}

/**
 * ThemeProvider가 주입하는 최종 CSS 변수 집합
 * shadows는 하위 호환용(기존 --ds-shadow-sm 등 키 유지)
 */
export interface ResolvedStyle {
  name: StyleName;
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inset: string;
  };
  border: {
    width: string;
    style: string;
  };
  /** 신규 슬롯에서 생성된 모든 CSS 변수 (material, filter, spatial, createVars) */
  vars: Record<string, string>;
}
