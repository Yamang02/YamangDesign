/**
 * 테마 프리셋 단일 소스 (SOT)
 * registry의 모든 테마를 metadata.id 기준으로 themePresets로 수집.
 * 새 팔레트 추가 시: 해당 카테고리 index.ts에 export만 추가하면 됨.
 */
import type { PaletteDefinition } from '../palettes';
import type { CustomSemanticPaletteId } from '@shared/types/palette-name';
import { getAllThemes } from '../palettes/presets/registry';

export type {
  BuiltinPaletteId,
  CustomSemanticPaletteId,
  PaletteName,
} from '@shared/types/palette-name';

const themes = getAllThemes();
const themePresets = Object.fromEntries(
  themes.map((t) => {
    const id = t.id;
    if (!id) {
      throw new Error(`Palette "${t.subname ?? t.id}" requires id`);
    }
    return [id, t] as const;
  })
) as Record<string, PaletteDefinition>;

export { themePresets };

export function isCustomSemanticPaletteId(name: string): name is CustomSemanticPaletteId {
  return name.startsWith('custom-semantic:');
}
