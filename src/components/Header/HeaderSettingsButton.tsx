/**
 * E02/E03: 설정 버튼 - 클릭 시 전역 설정 모달 오픈
 */
import { useState } from 'react';
import { clsx } from '../../utils/clsx';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { GlobalSettingsModal } from '../GlobalSettings';
import styles from './HeaderNav.module.css';

export function HeaderSettingsButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Tooltip content="설정" position="bottom">
        <button
          type="button"
          className={clsx(styles.navItem, modalOpen && styles.active)}
          onClick={() => setModalOpen(true)}
          aria-label="설정"
          aria-expanded={modalOpen}
          aria-haspopup="dialog"
        >
          <span className={styles.navItemIcon}>
            <Icon name="settings" size="md" />
          </span>
        </button>
      </Tooltip>

      <GlobalSettingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
