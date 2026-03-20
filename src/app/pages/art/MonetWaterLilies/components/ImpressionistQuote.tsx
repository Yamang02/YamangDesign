import styles from './ImpressionistQuote.module.css';

const QUOTE = 'I perhaps owe having become a painter to flowers.';
const ATTRIBUTION = 'Claude Monet';

export function ImpressionistQuote() {
  const words = QUOTE.split(' ');
  const totalDelay = words.length * 0.08;

  return (
    <div className={styles.card}>
      <blockquote className={styles.quote}>
        {words.map((word, i) => (
          <span key={i}>
            <span
              className={styles.word}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {word}
            </span>
            {' '}
          </span>
        ))}
      </blockquote>
      <div className={styles.divider} />
      <cite
        className={styles.attribution}
        style={{ animationDelay: `${totalDelay + 0.3}s` }}
      >
        {ATTRIBUTION}
      </cite>
    </div>
  );
}
