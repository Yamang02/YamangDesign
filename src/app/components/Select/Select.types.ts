import type { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * 선택 가능한 옵션 목록
   */
  options: SelectOption[];

  /**
   * 현재 선택된 값
   */
  value: string;

  /**
   * 값 변경 핸들러
   */
  onChange: (value: string) => void;

  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 스타일 변형
   */
  variant?: 'outline' | 'filled' | 'ghost';

  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 라벨 텍스트
   */
  label?: string;

  /**
   * controlled open 상태
   */
  open?: boolean;

  /**
   * controlled open 변경 핸들러
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * trigger 버튼 추가 클래스명
   */
  triggerClassName?: string;
}
