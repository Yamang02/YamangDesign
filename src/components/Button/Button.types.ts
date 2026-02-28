import type { ReactNode, MouseEvent } from 'react';

export interface ButtonProps {
  /**
   * 버튼 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'subtle';

  /**
   * 버튼 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 버튼 타입
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * 클릭 핸들러
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * 버튼 내용
   */
  children: ReactNode;

  /**
   * 추가 클래스명
   */
  className?: string;
}
