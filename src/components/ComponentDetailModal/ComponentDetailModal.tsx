/**
 * E02 P05: 컴포넌트 상세 모달
 * 크기 C(반응형), 백드롭 C(블러+반투명).
 * 섹션/라벨은 shell, 실제 컴포넌트만 data-context="preview"로 테마 적용(콘텐츠 측 래핑).
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import styles from './ComponentDetailModal.module.css';

export interface ComponentDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ComponentDetailModal({
  open,
  onClose,
  title,
  children,
}: ComponentDetailModalProps) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="component-detail-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-shell>
        <header className={styles.header}>
          <h2 id="component-detail-modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <Icon name="close" size="sm" />
          </button>
        </header>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
