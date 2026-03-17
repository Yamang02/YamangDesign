import { clsx } from '@shared/utils/clsx';
import styles from './TabBar.module.css';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  /** 'underline': border-bottom 인디케이터 (DesignSettingsLab 스타일)
   *  'pill': 배경 채움 (LabLayout 탭 모드 스타일) */
  variant?: 'underline' | 'pill';
}

export function TabBar({ tabs, activeTab, onChange, variant = 'underline' }: TabBarProps) {
  return (
    <div
      className={clsx(styles.tabBar, variant === 'pill' ? styles.pill : styles.underline)}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={clsx(styles.tab, activeTab === tab.id && styles.tabActive)}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
