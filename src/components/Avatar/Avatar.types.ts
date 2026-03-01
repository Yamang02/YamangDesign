import type { ReactNode } from 'react';

export interface AvatarProps {
  /**
   * 아바타에 표시할 이니셜 (이미지 없을 때)
   */
  initials?: string;

  /**
   * 이미지 URL (initials보다 우선)
   */
  src?: string;

  /**
   * 이미지 alt 텍스트
   */
  alt?: string;

  /**
   * 아바타 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 배경색 변형 (initials 사용 시)
   */
  variant?: 'primary' | 'secondary' | 'accent';

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 커스텀 콘텐츠 (initials, src 외)
   */
  children?: ReactNode;
}
