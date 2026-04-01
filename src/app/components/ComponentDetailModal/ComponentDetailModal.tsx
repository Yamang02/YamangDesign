/**
 * E02 P05: 컴포넌트 상세 모달
 * 크기 C(반응형), 백드롭 C(블러+반투명).
 * 섹션/라벨은 shell, 실제 컴포넌트만 data-context="preview"로 테마 적용(콘텐츠 측 래핑).
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import type { ComponentDetailModalProps } from './ComponentDetailModal.types';
import styles from './ComponentDetailModal.module.css';

export function ComponentDetailModal({
  open,
  onClose,
  title,
  children,
  previewStyle,
}: ComponentDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const d = dialogRef.current;
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    d?.showModal();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      d?.close();
      previousActiveElement.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <dialog // NOSONAR typescript:S6847
      ref={dialogRef}
      className={styles.overlay}
      aria-labelledby="component-detail-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className={styles.modal} data-shell>
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
        <div className={styles.body} data-context="preview" style={previewStyle}>
          {children}
        </div>
      </div>
    </dialog>
  );

  return createPortal(modal, document.body);
}
