import styles from './ImpressionistQuote.module.css';

const QUOTE = 'I perhaps owe having become a painter to flowers.';
const QUOTE_WORDS = QUOTE.split(' ');
const ATTRIBUTION = 'Claude Monet';
const QUOTE_WORD_ITEMS = QUOTE_WORDS.map((word, index) => ({
  word,
  key: `${word}-${QUOTE_WORDS.slice(0, index).filter((w) => w === word).length}`,
  delay: `${index * 0.08}s`,
}));

export function ImpressionistQuote() {
  const totalDelay = QUOTE_WORDS.length * 0.08;

  return (
    <div className={styles.card}>
      <blockquote className={styles.quote}>
        {QUOTE_WORD_ITEMS.map((item) => (
          <span key={item.key}>
            <span
              className={styles.word}
              style={{ animationDelay: item.delay }}
            >
              {item.word}
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
