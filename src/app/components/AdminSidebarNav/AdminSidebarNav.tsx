import { AdminSidebarItem } from '../AdminSidebarItem';
import styles from './AdminSidebarNav.module.css';
import type { AdminSidebarNavProps } from './AdminSidebarNav.types';

export function AdminSidebarNav({
  items,
  activeItemId,
  isCollapsed = false,
  onSelectItem,
}: Readonly<AdminSidebarNavProps>) {
  return (
    <nav className={styles.sidebar} data-collapsed={isCollapsed || undefined} aria-label="관리 페이지 탐색">
      {items.map((item) => (
        <AdminSidebarItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          isCollapsed={isCollapsed}
          isActive={item.id === activeItemId}
          onClick={() => onSelectItem?.(item.id)}
        />
      ))}
    </nav>
  );
}
