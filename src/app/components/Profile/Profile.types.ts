import type { ReactNode } from 'react';

export interface ProfileProps {
  /**
   * 아바타에 표시할 이니셜
   */
  initials: string;

  /**
   * 아바타 이미지 URL (initials보다 우선)
   */
  avatarSrc?: string;

  /**
   * 표시할 이름
   */
  name: string;

  /**
   * 표시할 역할/설명 (선택)
   */
  role?: string;

  /**
   * 아바타 크기
   */
  avatarSize?: 'sm' | 'md' | 'lg';

  /**
   * 아바타 배경 변형
   */
  avatarVariant?: 'primary' | 'secondary' | 'accent';

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 커스텀 아바타 (Avatar 대신)
   */
  avatar?: ReactNode;
}
