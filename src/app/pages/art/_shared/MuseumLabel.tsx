import styles from './MuseumLabel.module.css';

interface MuseumLabelProps {
  title: string
  subtitle?: string
  artist: string
  medium: string
  year: number
  yearEnd?: number
}

export function MuseumLabel({ title, subtitle, artist, medium, year, yearEnd }: Readonly<MuseumLabelProps>) {
  return (
    <div className={styles.label} aria-label="작품 정보">
      <span className={styles.title}>{title}</span>
      {subtitle && <span className={styles.sub}>{subtitle}</span>}
      <span className={styles.divider} />
      <span className={styles.meta}>
        {artist}<br />
        {medium}, {year}{yearEnd ? `–${String(yearEnd).slice(-2)}` : ''}
      </span>
    </div>
  );
}
