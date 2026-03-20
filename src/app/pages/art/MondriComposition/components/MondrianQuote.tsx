import styles from './MondrianQuote.module.css';

export function MondrianQuote() {
  return (
    <div className={styles.card}>
      <p className={styles.quote}>
        The position of the artist is humble. <br />
        He is essentially a channel.
      </p>
      <span className={styles.source}>— Piet Mondrian</span>
    </div>
  );
}
