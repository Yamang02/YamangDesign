import type { PalettePreset } from '@shared/@types/palette';

export interface PresetManagerProps {
  presets: PalettePreset[];
  onSave: (name: string) => void;
  onSelect: (preset: PalettePreset) => void;
  onDelete: (id: string) => void;
}
