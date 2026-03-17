import type { ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  /** true 시 포털로 body에 렌더링 (모달 내부 등 overflow 컨테이너에서 사용) */
  portal?: boolean;
  /** controlled open 상태. 제공 시 hover 무시하고 외부에서 제어 */
  open?: boolean;
  children: React.ReactElement;
}
