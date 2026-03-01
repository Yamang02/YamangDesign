import { useState } from 'react';
import type { NavigationProps } from './Navigation.types';
import { clsx } from '../../utils/clsx';
import styles from './Navigation.module.css';
import { useTheme } from '../../themes';
import { Button } from '../Button';
import { ColorPicker } from '../ColorPicker';
import { Icon } from '../Icon';
import { Select } from '../Select';
import { usePalettePresets } from '../../hooks/usePalettePresets';
import type { ExternalPalette } from '../../@types/tokens';
import type { ThemeName } from '../../@types/theme';

const themeOptions = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
  { value: 'brutalism', label: 'Brutalism' },
];

export function Navigation({
  brand = 'Design System',
  onBrandClick,
  showThemeToggle = true,
  showColorEditor = false,
  sticky = true,
  className,
  centerContent,
  rightContent,
  asSlot = false,
}: NavigationProps) {
  const { themeName, setThemeName, palette, setPalette } = useTheme();
  const [isColorEditorOpen, setIsColorEditorOpen] = useState(false);
  const [editingColors, setEditingColors] = useState<ExternalPalette>(palette);
  const { presets, savePreset, deletePreset } = usePalettePresets();

  const handleThemeChange = (value: string) => {
    setThemeName(value as ThemeName);
  };

  const handleColorChange = (newPalette: ExternalPalette) => {
    setEditingColors(newPalette);
  };

  const applyColors = () => {
    setPalette(editingColors);
    setIsColorEditorOpen(false);
  };

  const resetColors = () => {
    setEditingColors(palette);
  };

  const handleSavePreset = (name: string) => {
    savePreset(name, editingColors);
  };

  const handleLoadPreset = (preset: { palette: ExternalPalette }) => {
    setEditingColors(preset.palette);
  };

  const navContent = (
    <>
      {centerContent && (
        <div className={styles.center}>
          {centerContent}
        </div>
      )}

      <div className={styles.right}>
        {rightContent}

        {showColorEditor && (
          <>
            <button
              type="button"
              className={styles.colorEditorTrigger}
              onClick={() => {
                setEditingColors(palette);
                setIsColorEditorOpen(!isColorEditorOpen);
              }}
            >
              <Icon name="palette" size="sm" />
              <span className={styles.colorEditorTriggerLabel}>Colors</span>
            </button>

            {isColorEditorOpen && (
              <div className={styles.colorEditor}>
                <div className={styles.colorEditorHeader}>
                  <span>Color Palette</span>
                  <button
                    type="button"
                    className={styles.colorEditorClose}
                    onClick={() => setIsColorEditorOpen(false)}
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </div>

                <ColorPicker
                  palette={editingColors}
                  onChange={handleColorChange}
                  presets={presets}
                  onSavePreset={handleSavePreset}
                  onLoadPreset={handleLoadPreset}
                  onDeletePreset={deletePreset}
                  onLoadThemePreset={(colors) => setEditingColors(colors)}
                />

                <div className={styles.colorEditorActions}>
                  <Button variant="ghost" size="sm" onClick={resetColors}>
                    Reset
                  </Button>
                  <Button variant="primary" size="sm" onClick={applyColors}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {showThemeToggle && (
          <Select
            options={themeOptions}
            value={themeName}
            onChange={handleThemeChange}
            size="sm"
            variant="ghost"
          />
        )}
      </div>
    </>
  );

  if (asSlot) {
    return (
      <div className={clsx(styles.slot, className)} data-ui>
        {navContent}
      </div>
    );
  }

  return (
    <nav
      className={clsx(styles.nav, sticky && styles.sticky, className)}
      data-ui
    >
      <div className={styles.left}>
        <span
          className={styles.brand}
          onClick={onBrandClick}
          role={onBrandClick ? 'button' : undefined}
          tabIndex={onBrandClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onBrandClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onBrandClick();
            }
          }}
        >
          {brand}
        </span>
      </div>
      {navContent}
    </nav>
  );
}
