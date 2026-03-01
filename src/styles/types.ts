/**
 * Style 레이어 타입 정의
 * E02: GUI 스타일(그림자, 테두리)을 독립 레이어로 관리
 */

/** 스타일 프리셋 이름 */
export type StyleName =
  | 'minimal'
  | 'neumorphism'
  | 'brutalism';

/** 표면 처리 방식 */
export type SurfaceType = 'flat' | 'raised' | 'inset';

/** Style 정의 (createShadows는 배경색을 받아 그림자 반환) */
export interface StyleDefinition {
  name: StyleName;

  /** 그림자 생성 함수 (배경색을 받아 그림자 반환) */
  createShadows: (bgColor: string) => {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inset: string;
  };

  /** 경계선 설정 */
  border: {
    width: string;
    style: string;
    useColor: boolean;
  };

  /** 표면 처리 (가이드/문서용) */
  surface: {
    default: SurfaceType;
    interactive: SurfaceType;
    active: SurfaceType;
  };

  /** 상태 표현 방식 (가이드/문서용) */
  states: {
    hover: 'shadow' | 'background' | 'border';
    active: 'shadow' | 'background' | 'transform';
  };
}

/** 해석된 Style (특정 배경색에 적용 완료) */
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
}
