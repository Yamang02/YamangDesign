/**
 * E02/E03: 설정 버튼 — P05: 클릭 시 설정 페이지로 이동
 */
import { clsx } from '@shared/utils/clsx';
import { Icon } from '../Icon';
import type { HeaderSettingsButtonProps } from './HeaderSettingsButton.types';
import styles from './HeaderNav.module.css';

export function HeaderSettingsButton({
  onOpenSettings,
}: Readonly<HeaderSettingsButtonProps>) {
  return (
    <button
      type="button"
      className={clsx(
        styles.navItem,
        styles.navItemWithLabel
      )}
      onClick={() => onOpenSettings?.()}
      aria-label="Settings"
    >
      <span className={styles.navItemIcon}>
        <Icon name="settings" size="md" />
      </span>
      <span className={styles.navItemLabel}>Settings</span>
    </button>
  );
}
