/**
 * Lab Overview - 조정 가능한 요소 요약 카드
 * 각 Lab 페이지 상단에 표시되는 정보 카드
 */
import styles from './LabOverview.module.css';

export interface OverviewItem {
  label: string;
  description?: string;
}

export interface LabOverviewProps {
  /** Overview 설명 텍스트 */
  description?: string;
  /** 조정 가능한 요소 목록 */
  items?: OverviewItem[];
  /** 커스텀 컨텐츠 (다이어그램 등) */
  children?: React.ReactNode;
}

export function LabOverview({ description, items, children }: LabOverviewProps) {
  return (
    <div className={styles.overview}>
      {description && <p className={styles.description}>{description}</p>}
      {items && items.length > 0 && (
        <div className={styles.itemGrid}>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <span className={styles.itemLabel}>{item.label}</span>
              {item.description && (
                <span className={styles.itemDesc}>{item.description}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {children && <div className={styles.customContent}>{children}</div>}
    </div>
  );
}
