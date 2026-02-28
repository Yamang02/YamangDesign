/**
 * E08: Lab 공통 레이아웃
 * PaletteLab, StyleLab, FontLab, Playground 공통 구조
 */
import styles from './LabLayout.module.css';

export interface LabLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function LabLayout({ title, subtitle, children }: LabLayoutProps) {
  return (
    <div className={styles.labLayout}>
      <header className={styles.labHeader}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      <div className={styles.labContent}>{children}</div>
    </div>
  );
}
