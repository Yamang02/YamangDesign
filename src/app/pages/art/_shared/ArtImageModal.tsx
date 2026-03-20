import { useEffect } from 'react';
import styles from './ArtImageModal.module.css';

interface ArtImageModalProps {
  imageUrl: string
  imageAlt: string
  onClose: () => void
}

export function ArtImageModal({ imageUrl, imageAlt, onClose }: ArtImageModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt}
    >
      <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">✕</button>
      <img
        src={imageUrl}
        alt={imageAlt}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
