/**
 * E02/E03: 설정 버튼 - 클릭 시 전역 설정 모달 오픈 (아이콘 + settings)
 */
import { useState } from 'react';
import { clsx } from '../../utils/clsx';
import { Icon } from '../Icon';
import { GlobalSettingsModal } from '../GlobalSettings';
import styles from './HeaderNav.module.css';

export function HeaderSettingsButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={clsx(styles.navItem, styles.navItemWithLabel, modalOpen && styles.active)}
        onClick={() => setModalOpen(true)}
        aria-label="settings"
        aria-expanded={modalOpen}
        aria-haspopup="dialog"
      >
        <span className={styles.navItemIcon}>
          <Icon name="settings" size="md" />
        </span>
        <span className={styles.navItemLabel}>settings</span>
      </button>

      <GlobalSettingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
