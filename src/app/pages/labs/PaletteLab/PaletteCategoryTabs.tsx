/**
 * 브랜드 컬러 서브탭
 * Custom 선두 + registry 카테고리 동적 생성
 */
import type { ThemeCategory } from '@domain/palettes/types';
import { themeRegistry } from '@domain/palettes/presets/registry';
import { GenericTabs } from '../../../components/GenericTabs';

/** BrandColorTabId: 전체/커스텀 + ThemeCategory */
export type BrandColorTabId = ThemeCategory | 'all';

const CATEGORY_LABEL: Record<ThemeCategory, string> = {
  default: '기본',
  custom: '커스텀',
  natural: '내추럴',
  pop: '팝',
  historical: '히스토리컬',
};

const TABS: { id: BrandColorTabId; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'custom', label: '커스텀' },
  ...themeRegistry
    .filter((g) => g.category !== 'custom')
    .map((g) => ({
      id: g.category as BrandColorTabId,
      label: CATEGORY_LABEL[g.category] ?? g.displayName,
    })),
];

export interface PaletteCategoryTabsProps {
  activeTab: BrandColorTabId;
  onTabChange: (tab: BrandColorTabId) => void;
}

export function PaletteCategoryTabs({
  activeTab,
  onTabChange,
}: Readonly<PaletteCategoryTabsProps>) {
  return (
    <GenericTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      ariaLabel="브랜드 컬러"
    />
  );
}
