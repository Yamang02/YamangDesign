import styles from './MuseumLabel.module.css';

export function MuseumLabel() {
  return (
    <div className={styles.label} aria-label="작품 정보">
      <span className={styles.title}>Water Lilies: Green Reflections</span>
      <span className={styles.sub}>central section</span>
      <span className={styles.divider} />
      <span className={styles.meta}>
        Claude Monet<br />
        Oil on Canvas, 1914–18
      </span>
    </div>
  );
}
