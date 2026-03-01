/**
 * 테마 레지스트리 - 카테고리별 테마 조회 및 검색
 * P01: 카테고리 기반 테마 시스템 기반
 */
import type { PaletteDefinition, ThemeCategory } from '../types';
import * as defaultThemes from './default/index';
import * as naturalThemes from './natural/index';

export interface ThemeGroup {
  category: ThemeCategory;
  displayName: string;
  description: string;
  themes: PaletteDefinition[];
}

/** 전체 테마 레지스트리 */
export const themeRegistry: ThemeGroup[] = [
  {
    category: 'default',
    displayName: 'Default',
    description: '기본 시스템 테마',
    themes: Object.values(defaultThemes).filter(
      (v): v is PaletteDefinition => v !== undefined && typeof v === 'object'
    ),
  },
  {
    category: 'natural',
    displayName: 'Natural',
    description: '자연에서 영감을 받은 유기적이고 편안한 테마',
    themes: Object.values(naturalThemes).filter(
      (v): v is PaletteDefinition => v !== undefined && typeof v === 'object'
    ),
  },
];

/** ID로 테마 찾기 */
export function findThemeById(id: string): PaletteDefinition | undefined {
  return themeRegistry
    .flatMap((group) => group.themes)
    .find((theme) => theme.metadata?.id === id);
}

/** 카테고리별 테마 조회 */
export function getThemesByCategory(
  category: ThemeCategory
): PaletteDefinition[] {
  return themeRegistry.find((group) => group.category === category)?.themes ?? [];
}

/** 이름/설명으로 테마 검색 */
export function searchThemesByName(query: string): PaletteDefinition[] {
  const lowerQuery = query.toLowerCase();
  return themeRegistry
    .flatMap((group) => group.themes)
    .filter(
      (theme) =>
        theme.metadata?.displayName?.toLowerCase().includes(lowerQuery) ||
        theme.metadata?.description?.toLowerCase().includes(lowerQuery)
    );
}

/** 모든 테마 플랫 리스트 */
export function getAllThemes(): PaletteDefinition[] {
  return themeRegistry.flatMap((group) => group.themes);
}
