/**
 * E02: 아이콘 기반 네비게이션 - 단일 링크 아이템
 */
import type { ReactNode } from 'react';
import { clsx } from '../../utils/clsx';
import { Tooltip } from '../Tooltip';
import styles from './HeaderNav.module.css';

export interface HeaderNavItemProps {
  icon: ReactNode;
  label: string;
  tooltip?: string;
  active?: boolean;
  onClick: () => void;
}

export function HeaderNavItem({ icon, label, tooltip, active, onClick }: HeaderNavItemProps) {
  const content = (
    <button
      type="button"
      className={clsx(styles.navItem, active && styles.active)}
      onClick={onClick}
      aria-label={tooltip ?? label}
      aria-current={active ? 'page' : undefined}
    >
      <span className={styles.navItemIcon}>{icon}</span>
    </button>
  );

  return (
    <Tooltip content={tooltip ?? label} position="bottom">
      {content}
    </Tooltip>
  );
}
