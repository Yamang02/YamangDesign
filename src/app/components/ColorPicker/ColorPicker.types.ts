import type { ColorInput } from '@shared/@types/tokens';
import type { PalettePreset } from '@shared/@types/palette';

export interface ColorPickerProps {
  palette: ColorInput;
  onChange: (palette: ColorInput) => void;
  presets: PalettePreset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: PalettePreset) => void;
  onDeletePreset: (id: string) => void;
  /** E06: 테마 프리셋 불러오기 (선택적) */
  onLoadThemePreset?: (colors: ColorInput) => void;
}
