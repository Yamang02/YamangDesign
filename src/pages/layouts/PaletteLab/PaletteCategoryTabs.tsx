/**
 * 브랜드 컬러 서브탭 - Default | Natural | Custom
 * GenericTabs 컴포넌트를 래핑하여 사용
 */
import type { ThemeCategory } from '../../../palettes/types';
import { GenericTabs } from '../../../components/GenericTabs';

/** BrandColorTabId는 ThemeCategory의 alias */
export type BrandColorTabId = ThemeCategory;

const TABS = [
  { id: 'default' as const, label: 'Default' },
  { id: 'natural' as const, label: 'Natural' },
  { id: 'custom' as const, label: 'Custom' },
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
    <GenericTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      ariaLabel="브랜드 컬러"
    />
  );
}
