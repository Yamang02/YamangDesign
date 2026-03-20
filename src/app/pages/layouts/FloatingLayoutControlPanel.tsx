import { useState } from 'react';
import { LayoutControlPanel } from './LayoutControlPanel';
import styles from './FloatingLayoutControlPanel.module.css';

export function FloatingLayoutControlPanel() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <aside className={styles.panel} aria-label="Layout controls">
          <div className={styles.titleRow}>
            <h2 className={styles.title}>Layout Controls</h2>
            <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)}>
              닫기
            </button>
          </div>
          <LayoutControlPanel />
        </aside>
      )}
      {!open && (
        <button type="button" className={styles.fab} onClick={() => setOpen(true)}>
          Layout Controls
        </button>
      )}
    </>
  );
}
