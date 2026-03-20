import styles from './BrutalBackground.module.css';

export function BrutalBackground() {
  return (
    <div className={styles.bg} aria-hidden>
      <div className={`${styles.block} ${styles.blockRed}`} />
      <div className={`${styles.block} ${styles.blockGreen}`} />
      <div className={`${styles.block} ${styles.blockBlue}`} />
    </div>
  );
}
