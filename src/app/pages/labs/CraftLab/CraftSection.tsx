/**
 * E29: CraftLab — 기법별 섹션 (설명 / 코드 스니펫, 데모 없음)
 */
import styles from './CraftSection.module.css';

export interface CraftSectionProps {
  id: string;
  title: string;
  description: React.ReactNode;
  /** 참고용 코드 블록 */
  code: string;
}

export function CraftSection({
  id,
  title,
  description,
  code,
}: Readonly<CraftSectionProps>) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.description}>{description}</div>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </section>
  );
}
