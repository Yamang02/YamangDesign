import type { ReactNode } from 'react';

export interface NavigationProps {
  /**
   * 브랜드/로고 텍스트
   */
  brand?: string;

  /**
   * 브랜드 클릭 핸들러
   */
  onBrandClick?: () => void;

  /**
   * 테마 토글 표시 여부
   */
  showThemeToggle?: boolean;

  /**
   * 컬러 에디터 표시 여부
   */
  showColorEditor?: boolean;

  /**
   * 고정 여부 (sticky)
   */
  sticky?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 중앙 영역 커스텀 컨텐츠 (페이지 네비게이션 등)
   */
  centerContent?: ReactNode;

  /**
   * 우측 영역 커스텀 컨텐츠
   */
  rightContent?: ReactNode;

  /**
   * E01: Header 슬롯 모드 - nav/left 없이 center+right만 렌더 (Header children용)
   */
  asSlot?: boolean;
}
