import { Button } from '../Button';
import styles from './AdminHeaderBar.module.css';
import type { AdminHeaderBarProps } from './AdminHeaderBar.types';

export function AdminHeaderBar({
  isSidebarCollapsed,
  onToggleSidebar,
  title = 'Admin',
  actions,
}: Readonly<AdminHeaderBarProps>) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className={styles.toggle}
          aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {isSidebarCollapsed ? '>' : '<'}
        </Button>
        <span className={styles.title}>{title}</span>
      </div>
      {actions}
    </header>
  );
}
