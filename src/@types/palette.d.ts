import type { ColorInput } from './tokens';

/**
 * 저장된 팔레트 프리셋
 */
export interface PalettePreset {
  id: string;
  name: string;
  palette: ColorInput;
  createdAt: number;
  isDefault?: boolean;
}

/**
 * localStorage에 저장되는 프리셋 데이터 구조
 */
export interface PalettePresetsStorage {
  version: number;
  presets: PalettePreset[];
}
