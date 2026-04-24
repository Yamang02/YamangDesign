import styles from './AdminShellLayout.module.css';
import type { AdminShellLayoutProps } from './AdminShellLayout.types';

export function AdminShellLayout({
  sidebar,
  header,
  children,
}: Readonly<AdminShellLayoutProps>) {
  return (
    <section className={styles.root}>
      {sidebar}
      <div className={styles.main}>
        {header}
        <main className={styles.content}>{children}</main>
      </div>
    </section>
  );
}
