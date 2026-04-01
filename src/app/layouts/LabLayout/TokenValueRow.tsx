import styles from './TokenValueRow.module.css';

export interface TokenValueRowProps {
  label: string;
  /** "--ds-xxx" 형태의 토큰명 (optional) */
  token?: string;
  value: string;
}

export function TokenValueRow({ label, token, value }: Readonly<TokenValueRowProps>) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      {token && <code className={styles.token}>{token}</code>}
      <span className={styles.value}>{value}</span>
    </div>
  );
}
