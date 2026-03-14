/**
 * E02/E03: 설정 버튼 — P05: 클릭 시 설정 페이지로 이동
 */
import { clsx } from '../../utils/clsx';
import { Icon } from '../Icon';
import styles from './HeaderNav.module.css';

export interface HeaderSettingsButtonProps {
  /** 설정 페이지로 이동 (design-settings) */
  onOpenSettings?: () => void;
}

export function HeaderSettingsButton({
  onOpenSettings,
}: HeaderSettingsButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        styles.navItem,
        styles.navItemWithLabel
      )}
      onClick={() => onOpenSettings?.()}
      aria-label="settings"
    >
      <span className={styles.navItemIcon}>
        <Icon name="settings" size="md" />
      </span>
      <span className={styles.navItemLabel}>settings</span>
    </button>
  );
}
