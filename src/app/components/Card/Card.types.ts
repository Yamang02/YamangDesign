import type { ReactNode } from 'react';

export interface CardProps {
  /**
   * 카드 변형
   */
  variant?: 'elevated' | 'outlined' | 'flat';

  /**
   * 패딩 크기
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * hover 시 elevation 증가
   */
  hoverable?: boolean;

  /**
   * 클릭 가능 (cursor: pointer)
   */
  clickable?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 클릭 핸들러
   */
  onClick?: () => void;

  /**
   * 카드 내용
   */
  children: ReactNode;

  /**
   * 추가 클래스명
   */
  className?: string;
}

export interface CardSectionProps {
  children: ReactNode;
  className?: string;
}
