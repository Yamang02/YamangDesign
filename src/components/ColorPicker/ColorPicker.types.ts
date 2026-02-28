import type { ExternalPalette } from '../../@types/tokens';
import type { PalettePreset } from '../../@types/palette';

export interface HexInputProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  showColorPreview?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export interface PresetManagerProps {
  presets: PalettePreset[];
  onSave: (name: string) => void;
  onLoad: (preset: PalettePreset) => void;
  onDelete: (id: string) => void;
}

export interface ColorPickerProps {
  palette: ExternalPalette;
  onChange: (palette: ExternalPalette) => void;
  presets: PalettePreset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: PalettePreset) => void;
  onDeletePreset: (id: string) => void;
}
