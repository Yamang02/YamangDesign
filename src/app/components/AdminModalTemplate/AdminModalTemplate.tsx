import { Button } from '../Button';
import styles from './AdminModalTemplate.module.css';
import type { AdminModalTemplateProps } from './AdminModalTemplate.types';

export function AdminModalTemplate({
  isOpen,
  title,
  children,
  isLoading = false,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: Readonly<AdminModalTemplateProps>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modal}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>{children}</div>
        <div className={styles.actions}>
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant="primary" size="sm" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? '처리 중' : confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
