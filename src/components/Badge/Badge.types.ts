import type { ReactNode } from 'react';

export interface BadgeProps {
  /**
   * 배지 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'subtle';

  /**
   * 배지 크기
   */
  size?: 'sm' | 'md';

  /**
   * 배지 내용
   */
  children: ReactNode;

  /**
   * 추가 클래스명
   */
  className?: string;
}
