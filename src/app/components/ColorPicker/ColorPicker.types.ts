import type { ColorInput } from '@shared/@types/tokens';
import type { PalettePreset } from '@shared/@types/palette';

export interface ColorPickerProps {
  palette: ColorInput;
  onChange: (palette: ColorInput) => void;
  presets: PalettePreset[];
  onSave: (name: string) => void;
  onSelect: (preset: PalettePreset) => void;
  onDelete: (id: string) => void;
  /** E06: 테마 프리셋 불러오기 (선택적) */
  onLoadThemePreset?: (colors: ColorInput) => void;
}
