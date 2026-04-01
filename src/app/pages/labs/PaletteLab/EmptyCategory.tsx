/**
 * P04: 빈 카테고리 메시지
 * Natural 등 테마가 없을 때 표시
 */
import styles from './EmptyCategory.module.css';

export interface EmptyCategoryProps {
  /** 표시 메시지 */
  message?: string;
}

export function EmptyCategory({
  message = '아직 테마가 없습니다',
}: Readonly<EmptyCategoryProps>) {
  return (
    <div className={styles.empty} aria-live="polite">
      <p className={styles.message}>{message}</p>
    </div>
  );
}
