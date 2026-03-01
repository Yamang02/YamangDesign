/**
 * P04: 테마 카테고리 탭 네비게이션
 * Custom, Default, Natural 탭
 */
import type { ThemeCategory } from '../../../palettes/types';
import styles from './ThemeTabNavigation.module.css';

export interface ThemeTabNavigationProps {
  /** 현재 선택된 탭 */
  activeTab: ThemeCategory;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: ThemeCategory) => void;
}

const TABS: { id: ThemeCategory; label: string }[] = [
  { id: 'custom', label: 'Custom' },
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
];

export function ThemeTabNavigation({
  activeTab,
  onTabChange,
}: ThemeTabNavigationProps) {
  return (
    <div
      className={styles.tabList}
      role="tablist"
      aria-label="테마 카테고리"
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
