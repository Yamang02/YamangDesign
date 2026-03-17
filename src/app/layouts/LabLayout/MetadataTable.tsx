import styles from './MetadataTable.module.css';

export interface MetadataRow {
  key: string;
  value: string;
}

export interface MetadataTableProps {
  rows: MetadataRow[];
  title?: string;
}

export function MetadataTable({ rows, title }: MetadataTableProps) {
  return (
    <div className={styles.wrapper}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.table}>
        {rows.map((row) => (
          <div key={row.key} className={styles.row}>
            <span className={styles.key}>{row.key}</span>
            <code className={styles.value}>{row.value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
