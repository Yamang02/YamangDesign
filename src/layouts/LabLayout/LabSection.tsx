/**
 * E08: Lab 섹션 - 서브타이틀 + 콘텐츠
 */
import styles from './LabLayout.module.css';

export interface LabSectionProps {
  title: string;
  children: React.ReactNode;
  withDivider?: boolean;
}

export function LabSection({ title, children, withDivider = true }: LabSectionProps) {
  return (
    <>
      {withDivider && <hr className={styles.sectionDivider} />}
      <section className={styles.labSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionContent}>{children}</div>
      </section>
    </>
  );
}
