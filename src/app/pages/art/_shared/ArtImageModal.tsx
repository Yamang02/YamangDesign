import { useEffect, useRef } from 'react';
import styles from './ArtImageModal.module.css';

interface ArtImageModalProps {
  imageUrl: string
  imageAlt: string
  onClose: () => void
}

export function ArtImageModal({ imageUrl, imageAlt, onClose }: Readonly<ArtImageModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const d = dialogRef.current;
    d?.showModal();
    return () => {
      document.removeEventListener('keydown', handleKey);
      d?.close();
    };
  }, [onClose]);

  return (
    <dialog // NOSONAR typescript:S6847 — 네이티브 dialog 백드롭 닫기
      ref={dialogRef}
      className={styles.backdrop}
      aria-label={imageAlt}
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
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
        ✕
      </button>
      <button
        type="button"
        className={styles.imageWrap}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
        }}
        aria-label={imageAlt}
      >
        <img src={imageUrl} alt="" className={styles.image} />
      </button>
    </dialog>
  );
}
