/**
 * 범용 탭 컴포넌트
 * PaletteCategoryTabs, ThemeTabNavigation 등에서 공통 사용
 */
import type { GenericTabsProps } from './GenericTabs.types';
import styles from './GenericTabs.module.css';

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
          title={tab.label}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
