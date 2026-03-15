/**
 * E02: 아이콘 기반 네비게이션 - 단일 링크 아이템 (아이콘 + 메뉴명)
 */
import type { ReactNode } from 'react';
import { clsx } from '@shared/utils/clsx';
import styles from './HeaderNav.module.css';

export interface HeaderNavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function HeaderNavItem({ icon, label, active, onClick }: HeaderNavItemProps) {
  return (
    <button
      type="button"
      className={clsx(styles.navItem, styles.navItemWithLabel, active && styles.active)}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <span className={styles.navItemIcon}>{icon}</span>
      <span className={styles.navItemLabel}>{label}</span>
    </button>
  );
}
