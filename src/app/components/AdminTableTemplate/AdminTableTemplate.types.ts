import type { ReactNode } from 'react';

export interface AdminTableColumn<TItem> {
  key: string;
  header: string;
  render: (item: TItem) => ReactNode;
}

export interface AdminTableTemplateProps<TItem> {
  title?: string;
  searchSlot?: ReactNode;
  filterSlot?: ReactNode;
  actionSlot?: ReactNode;
  onRefresh?: () => void;
  onReset?: () => void;
  columns: readonly AdminTableColumn<TItem>[];
  items: readonly TItem[];
  getRowKey: (item: TItem) => string;
}
