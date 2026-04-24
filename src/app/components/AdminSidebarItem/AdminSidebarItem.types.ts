import type { ReactNode } from 'react';

export interface AdminSidebarItemProps {
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  isCollapsed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
