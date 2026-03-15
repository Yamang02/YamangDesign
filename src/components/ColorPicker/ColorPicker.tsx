import type { ColorPickerProps } from './ColorPicker.types';
import styles from './ColorPicker.module.css';
import { HexInput } from './HexInput';
import { PresetManager } from './PresetManager';
import { Icon } from '../Icon';
import type { ColorInput } from '../../@types/tokens';
import { themePresets } from '../../constants/palette-definitions';

const colorFields: {
  key: keyof ColorInput;
  label: string;
  required: boolean;
}[] = [
  { key: 'primary', label: 'Primary', required: true },
  { key: 'secondary', label: 'Secondary', required: false },
  { key: 'accent', label: 'Accent', required: false },
  { key: 'sub', label: 'Sub', required: false },
  { key: 'neutral', label: 'Neutral', required: false },
];

const themePresetEntries = Object.entries(themePresets) as [
  string,
  { id: string; displayName?: string; colors: ColorInput },
][];

export function ColorPicker({
  palette,
  onChange,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onLoadThemePreset,
}: ColorPickerProps) {
  const handleColorChange = (key: keyof ColorInput, value: string) => {
    onChange({
      ...palette,
      [key]: value || undefined,
    });
  };

  const handleClearColor = (key: keyof ColorInput) => {
    const newPalette = { ...palette };
    delete newPalette[key];
    onChange(newPalette);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>
          <Icon name="palette" size="sm" />
          Colors
        </span>
        <div className={styles.colorFields}>
          {colorFields.map((field) => (
            <div key={field.key} className={styles.colorFieldItem}>
              <HexInput
                label={`${field.label}${field.required ? ' *' : ''}`}
                value={palette[field.key] || '#CCCCCC'}
                onChange={(value) => handleColorChange(field.key, value)}
              />
              {!field.required && palette[field.key] && (
                <button
                  type="button"
                  onClick={() => handleClearColor(field.key)}
                  className={styles.autoButton}
                  title="Use auto-derived color"
                >
                  Auto
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {onLoadThemePreset && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>
            <Icon name="palette" library="nucleo" size="sm" />
            Theme Presets
          </span>
          <div className={styles.themePresetRow}>
            {themePresetEntries.map(([id, def]) => (
              <button
                key={id}
                type="button"
                className={styles.themePresetChip}
                onClick={() => onLoadThemePreset(def.colors)}
                title={def.displayName ?? def.id}
              >
                <span
                  className={styles.themePresetDot}
                  style={{
                    backgroundColor: def.colors.primary || '#CCC',
                  }}
                />
                <span className={styles.themePresetLabel}>
                  {(def.displayName ?? def.id).charAt(0).toUpperCase() + (def.displayName ?? def.id).slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <PresetManager
        presets={presets}
        onSave={onSavePreset}
        onLoad={onLoadPreset}
        onDelete={onDeletePreset}
      />
    </div>
  );
}
