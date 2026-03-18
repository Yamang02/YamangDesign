import styles from './LabLayout.module.css';

export interface LabPanelProps {
  title: string;
  children: React.ReactNode;
  /** 패널 ID (TOC 서브앵커용) */
  id?: string;
  /** 제목과 같은 행에 표시할 설명 */
  description?: React.ReactNode;
}

export function LabPanel({ title, children, id, description }: LabPanelProps) {
  return (
    <div id={id} className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{title}</h3>
        {description != null && (
          <p className={styles.panelDescInline}>{description}</p>
        )}
      </div>
      <div className={styles.panelContent}>{children}</div>
    </div>
  );
}
