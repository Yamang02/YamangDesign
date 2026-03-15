export interface ComponentDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** E08 P03: Build 페이지 테마 탐구용 — 컴포넌트 영역에 적용할 CSS 변수 객체 */
  previewStyle?: React.CSSProperties;
}
