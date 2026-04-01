/**
 * E02: 아이콘 기반 네비게이션 - 단일 링크 아이템 (아이콘 + 메뉴명)
 */
import { clsx } from '@shared/utils/clsx';
import type { HeaderNavItemProps } from './HeaderNavItem.types';
import styles from './HeaderNav.module.css';

export function HeaderNavItem({ icon, label, active, onClick, display = 'icon+label' }: Readonly<HeaderNavItemProps>) {
  return (
    <button
      type="button"
      className={clsx(styles.navItem, styles.navItemWithLabel, active && styles.active)}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      {display !== 'label-only' && <span className={styles.navItemIcon}>{icon}</span>}
      {display !== 'icon-only' && <span className={styles.navItemLabel}>{label}</span>}
    </button>
  );
}
