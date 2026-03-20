import styles from './ArtworkInfoCard.module.css';

const META = [
  { label: 'Year', value: '1906' },
  { label: 'Medium', value: 'Oil on canvas' },
  { label: 'Collection', value: 'Art Institute of Chicago' },
];

export function ArtworkInfoCard() {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Water Lilies</h1>
      <p className={styles.artist}>Claude Monet</p>
      <hr className={styles.divider} />
      <dl className={styles.meta}>
        {META.map(({ label, value }) => (
          <div key={label} className={styles.metaRow}>
            <dt className={styles.metaLabel}>{label}</dt>
            <dd className={styles.metaValue}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
