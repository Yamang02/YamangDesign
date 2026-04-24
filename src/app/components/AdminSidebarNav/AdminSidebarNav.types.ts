import type { ReactNode } from 'react';

export interface AdminSidebarNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface AdminSidebarNavProps {
  items: readonly AdminSidebarNavItem[];
  activeItemId?: string;
  isCollapsed?: boolean;
  onSelectItem?: (itemId: string) => void;
}
