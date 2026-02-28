import type { ChangeEvent, FocusEvent } from 'react';

export interface InputProps {
  /**
   * input 타입
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

  /**
   * 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 입력 변형
   */
  variant?: 'outline' | 'filled' | 'flushed';

  /**
   * 플레이스홀더
   */
  placeholder?: string;

  /**
   * 현재 값
   */
  value?: string;

  /**
   * 기본값 (비제어)
   */
  defaultValue?: string;

  /**
   * 비활성화
   */
  disabled?: boolean;

  /**
   * 읽기 전용
   */
  readOnly?: boolean;

  /**
   * 필수 입력
   */
  required?: boolean;

  /**
   * 에러 상태
   */
  isError?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  /**
   * 전체 너비
   */
  fullWidth?: boolean;

  /**
   * 값 변경 핸들러
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * 포커스 핸들러
   */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;

  /**
   * 블러 핸들러
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  /**
   * 라벨 (접근성)
   */
  label?: string;

  /**
   * ID (라벨 연결용)
   */
  id?: string;

  /**
   * 추가 클래스명
   */
  className?: string;
}
