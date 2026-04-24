import type { ReactNode } from 'react';

export interface AdminHeaderBarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  title?: string;
  actions?: ReactNode;
}
