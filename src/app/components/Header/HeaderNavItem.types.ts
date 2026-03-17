import type { ReactNode } from 'react';

export interface HeaderNavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  display?: 'icon+label' | 'icon-only' | 'label-only';
}
