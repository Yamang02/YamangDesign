/**
 * 브랜드 컬러 서브탭
 * Custom 선두 + registry 카테고리 동적 생성
 */
import type { ThemeCategory } from '@domain/palettes/types';
import { themeRegistry } from '@domain/palettes/presets/registry';
import { GenericTabs } from '../../../components/GenericTabs';

/** BrandColorTabId는 ThemeCategory의 alias */
export type BrandColorTabId = ThemeCategory;

const TABS: { id: BrandColorTabId; label: string }[] = [
  { id: 'custom', label: 'Custom' },
  ...themeRegistry.map((g) => ({ id: g.category as BrandColorTabId, label: g.displayName })),
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
