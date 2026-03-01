/**
 * 범용 탭 컴포넌트
 * PaletteCategoryTabs, ThemeTabNavigation 등에서 공통 사용
 */
import styles from './GenericTabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface GenericTabsProps<T extends string> {
  /** 탭 목록 */
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  /** 현재 활성 탭 ID */
  activeTab: T;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: T) => void;
  /** 접근성 레이블 */
  ariaLabel: string;
  /** 추가 클래스명 */
  className?: string;
}

export function GenericTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className,
}: GenericTabsProps<T>) {
  return (
    <div
      className={`${styles.tabList}${className ? ` ${className}` : ''}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={styles.tab}
          data-active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          tabIndex={activeTab === tab.id ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
