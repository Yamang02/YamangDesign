/**
 * 테마 프리셋 단일 소스 (SOT)
 * registry의 모든 테마를 metadata.id 기준으로 themePresets로 수집.
 * 새 팔레트 추가 시: 해당 카테고리 index.ts에 export만 추가하면 됨.
 */
import type { PaletteDefinition } from '../palettes';
import { getAllThemes } from '../palettes/presets/registry';

const themes = getAllThemes();
const themePresets = Object.fromEntries(
  themes.map((t) => {
    const id = t.metadata?.id;
    if (!id) {
      throw new Error(`Palette "${t.subname ?? t.name}" requires metadata.id`);
    }
    return [id, t] as const;
  })
) as Record<string, PaletteDefinition>;

export { themePresets };

/** Lab/Playground 등에서 사용하는 프리셋 팔레트 이름 */
export type PresetPaletteName = keyof typeof themePresets;

/** 시맨틱 매핑 커스텀 프리셋 ID (베이스 참조 + 오버라이드) */
export type CustomSemanticPaletteId = `custom-semantic:${string}`;

/** 사용자 정의 포함 전체 팔레트 이름 */
export type PaletteName = PresetPaletteName | 'custom' | CustomSemanticPaletteId;

export function isCustomSemanticPaletteId(
  name: string
): name is CustomSemanticPaletteId {
  return name.startsWith('custom-semantic:');
}
