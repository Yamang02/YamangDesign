import type { ReactNode } from 'react';

export interface AdminFilterBarBaseProps {
  searchSlot?: ReactNode;
  filterSlot?: ReactNode;
  actionSlot?: ReactNode;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onRefresh?: () => void;
  onReset?: () => void;
}
