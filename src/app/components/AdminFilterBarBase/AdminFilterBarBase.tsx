import { Button } from '../Button';
import styles from './AdminFilterBarBase.module.css';
import type { AdminFilterBarBaseProps } from './AdminFilterBarBase.types';

export function AdminFilterBarBase({
  searchSlot,
  filterSlot,
  actionSlot,
  isExpandable = false,
  isExpanded = false,
  onToggleExpand,
  onRefresh,
  onReset,
}: Readonly<AdminFilterBarBaseProps>) {
  return (
    <section className={styles.container} aria-label="관리 페이지 검색 및 필터 바">
      <div className={styles.search}>{searchSlot}</div>
      <div className={styles.filters}>{filterSlot}</div>
      <div className={styles.actions}>
        {actionSlot}
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            새로고침
          </Button>
        )}
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            초기화
          </Button>
        )}
        {isExpandable && onToggleExpand && (
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {isExpanded ? '필터 접기' : '필터 펼치기'}
          </Button>
        )}
      </div>
    </section>
  );
}
