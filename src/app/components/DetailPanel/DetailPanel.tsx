/**
 * E08: 슬라이드 상세 패널 - Lab 카드 클릭 시 표시
 */
import { clsx } from '@shared/utils/clsx';
import { Icon } from '../Icon';
import type { DetailPanelProps } from './DetailPanel.types';
import styles from './DetailPanel.module.css';

export function DetailPanel({ open, onClose, title, children }: DetailPanelProps) {
  return (
    <aside
      className={clsx(styles.detailPanel, open && styles.open)}
      data-shell
      aria-hidden={!open}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          <Icon name="close" size="sm" />
        </button>
      </header>
      <div className={styles.panelContent} data-shell>
        {children}
      </div>
    </aside>
  );
}
