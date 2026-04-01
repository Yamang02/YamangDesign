/**
 * E08: Lab 섹션 - 서브타이틀 + 콘텐츠
 * E02: 카드 스타일 래퍼 추가
 */
import styles from './LabLayout.module.css';

export interface LabSectionProps {
  title: string;
  children: React.ReactNode;
  /** 카드 스타일 적용 여부 (기본: true) */
  card?: boolean;
  /** 섹션 ID (E03 TOC 연동용) */
  id?: string;
  /** 제목과 같은 행에 표시할 설명 (Token Lab 등) */
  description?: React.ReactNode;
}

export function LabSection({
  title,
  children,
  card = true,
  id,
  description,
}: Readonly<LabSectionProps>) {
  const header = (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description != null && (
        <p className={styles.sectionDescInline}>{description}</p>
      )}
    </div>
  );

  if (!card) {
    return (
      <section id={id} className={styles.labSection}>
        {header}
        <div className={styles.sectionContent}>{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={styles.labSection}>
      {header}
      <div className={styles.sectionCard}>
        <div className={styles.sectionContent}>{children}</div>
      </div>
    </section>
  );
}
