import type { ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  /** true 시 포털로 body에 렌더링 (모달 내부 등 overflow 컨테이너에서 사용) */
  portal?: boolean;
  children: React.ReactElement;
}
