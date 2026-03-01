/**
 * 브랜드 컬러 서브탭 - Default | Natural
 */
import styles from './ThemeTabNavigation.module.css';

export type BrandColorTabId = 'default' | 'natural';

const TABS: { id: BrandColorTabId; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
];

export interface PaletteCategoryTabsProps {
  activeTab: BrandColorTabId;
  onTabChange: (tab: BrandColorTabId) => void;
}

export function PaletteCategoryTabs({
  activeTab,
  onTabChange,
}: PaletteCategoryTabsProps) {
  return (
    <div
      className={styles.tabList}
      role="tablist"
      aria-label="브랜드 컬러"
    >
      {TABS.map((tab) => (
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
