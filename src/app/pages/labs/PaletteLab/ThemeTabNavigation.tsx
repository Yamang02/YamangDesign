/**
 * P04: 테마 카테고리 탭 네비게이션
 * Custom 선두 + registry 카테고리 동적 생성
 */
import type { ThemeCategory } from '@domain/palettes/types';
import { themeRegistry } from '@domain/palettes/presets/registry';
import styles from './ThemeTabNavigation.module.css';

export interface ThemeTabNavigationProps {
  /** 현재 선택된 탭 */
  activeTab: ThemeCategory;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: ThemeCategory) => void;
}

const TABS: { id: ThemeCategory; label: string }[] = [
  { id: 'custom', label: 'Custom' },
  ...themeRegistry.map((g) => ({ id: g.category, label: g.displayName })),
];

export function ThemeTabNavigation({
  activeTab,
  onTabChange,
}: Readonly<ThemeTabNavigationProps>) {
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
