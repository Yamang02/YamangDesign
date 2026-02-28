import type { ColorPickerProps } from './ColorPicker.types';
import styles from './ColorPicker.module.css';
import { HexInput } from './HexInput';
import { PresetManager } from './PresetManager';
import { Icon } from '../Icon';
import type { ExternalPalette } from '../../@types/tokens';

const colorFields: {
  key: keyof ExternalPalette;
  label: string;
  required: boolean;
}[] = [
  { key: 'primary', label: 'Primary', required: true },
  { key: 'secondary', label: 'Secondary', required: false },
  { key: 'accent', label: 'Accent', required: false },
  { key: 'sub', label: 'Sub', required: false },
];

export function ColorPicker({
  palette,
  onChange,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: ColorPickerProps) {
  const handleColorChange = (key: keyof ExternalPalette, value: string) => {
    onChange({
      ...palette,
      [key]: value || undefined,
    });
  };

  const handleClearColor = (key: keyof ExternalPalette) => {
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

      <PresetManager
        presets={presets}
        onSave={onSavePreset}
        onLoad={onLoadPreset}
        onDelete={onDeletePreset}
      />
    </div>
  );
}
