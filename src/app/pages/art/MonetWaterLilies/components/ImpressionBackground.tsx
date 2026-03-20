import styles from './ImpressionBackground.module.css';

export function ImpressionBackground() {
  return (
    <div className={styles.bg} aria-hidden>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />
    </div>
  );
}
