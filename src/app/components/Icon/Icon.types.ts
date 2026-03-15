export type IconLibrary = 'nucleo' | 'material';

export type IconSize = 'sm' | 'md' | 'lg' | number;

export interface IconProps {
  /**
   * 아이콘 이름
   */
  name: string;

  /**
   * 아이콘 라이브러리
   */
  library?: IconLibrary;

  /**
   * 아이콘 크기 (sm: 16, md: 20, lg: 24 또는 숫자)
   */
  size?: IconSize;

  /**
   * 아이콘 색상 (CSS 변수 또는 HEX)
   */
  color?: string;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 접근성 라벨
   */
  title?: string;

  /**
   * 인라인 스타일
   */
  style?: React.CSSProperties;
}
