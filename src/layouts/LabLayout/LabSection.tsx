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
}

export function LabSection({
  title,
  children,
  card = true,
  id,
}: LabSectionProps) {
  const content = (
    <section id={id} className={styles.labSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );

  if (!card) return content;

  return <div className={styles.sectionCard}>{content}</div>;
}
