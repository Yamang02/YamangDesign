import type { ReactNode } from 'react';

export interface HeaderNavDropdownItem {
  id: string;
  label: string;
  icon?: string;
}

export interface HeaderNavDropdownProps {
  icon: ReactNode;
  label: string;
  items: HeaderNavDropdownItem[];
  active?: boolean;
  activeItemId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (itemId: string) => void;
}
