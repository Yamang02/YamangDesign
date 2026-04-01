import { useState } from 'react';
import type { PresetManagerProps } from './PresetManager.types';
import styles from './ColorPicker.module.css';
import { Icon } from '../Icon';
import { resolvePalette, generateColorScales } from '@domain/palettes/palette';

export function PresetManager({
  presets,
  onSave,
  onSelect,
  onDelete,
}: Readonly<PresetManagerProps>) {
  const [newPresetName, setNewPresetName] = useState('');

  const handleSave = () => {
    if (newPresetName.trim()) {
      onSave(newPresetName.trim());
      setNewPresetName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className={styles.section}>
      <span className={styles.sectionTitle}>
        <Icon name="folder" library="nucleo" size="sm" />
        Presets
      </span>

      <div className={styles.savePresetRow}>
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Preset name..."
          className={styles.savePresetInput}
        />
        <button
          type="button"
          onClick={handleSave}
          className={styles.savePresetButton}
          disabled={!newPresetName.trim()}
        >
          <Icon name="save" size="sm" />
          Save
        </button>
      </div>

      <div className={styles.presetList}>
        {presets.map((preset) => {
          const resolved = resolvePalette(preset.palette);
          const scales = generateColorScales(resolved);
          return (
            <button
              type="button"
              key={preset.id}
              className={styles.presetItem}
              onClick={() => onSelect(preset)}
            >
              <div className={styles.presetColors}>
                <div
                  className={styles.presetColorDot}
                  style={{ backgroundColor: scales.primary[500] }}
                />
                <div
                  className={styles.presetColorDot}
                  style={{ backgroundColor: scales.secondary[500] }}
                />
                <div
                  className={styles.presetColorDot}
                  style={{ backgroundColor: scales.accent[500] }}
                />
                <div
                  className={styles.presetColorDot}
                  style={{ backgroundColor: scales.neutral[500] }}
                />
              </div>
              <span className={styles.presetName}>
                {preset.name}
                {preset.isDefault && ' (Default)'}
              </span>
              {!preset.isDefault && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(preset.id);
                  }}
                  className={styles.presetDeleteButton}
                  aria-label={`${preset.name} 삭제`}
                >
                  <Icon name="delete" size="sm" />
                </button>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
