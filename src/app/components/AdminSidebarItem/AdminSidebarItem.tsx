import styles from './AdminSidebarItem.module.css';
import type { AdminSidebarItemProps } from './AdminSidebarItem.types';

export function AdminSidebarItem({
  label,
  icon,
  isActive = false,
  isCollapsed = false,
  disabled = false,
  onClick,
}: Readonly<AdminSidebarItemProps>) {
  return (
    <button
      type="button"
      className={styles.item}
      data-active={isActive || undefined}
      data-collapsed={isCollapsed || undefined}
      disabled={disabled}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={isCollapsed ? label : undefined}
      title={isCollapsed ? label : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {!isCollapsed && <span className={styles.label}>{label}</span>}
    </button>
  );
}
