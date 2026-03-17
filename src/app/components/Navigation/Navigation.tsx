/**
 * Navigation 컴포넌트
 * PaletteSelection 기반 마이그레이션
 */
import { useState } from 'react';
import type { NavigationProps } from './Navigation.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Navigation.module.css';
import { useTheme } from '@domain/themes';
import { Button } from '../Button';
import { ColorPicker } from '../ColorPicker';
import { Icon } from '../Icon';
import { Select } from '../Select';
import { usePalettePresets } from '../../hooks/usePalettePresets';
import { createCustomSelection } from '@app/state/palette-selection';
import type { ColorInput } from '@shared/@types/tokens';
import type { StyleName } from '@shared/@types/theme';

const themeOptions = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
  { value: 'brutalism', label: 'Brutalism' },
];

export function Navigation({
  brand = 'Design System',
  onLogoClick,
  showThemeToggle = true,
  showColorEditor = false,
  sticky = true,
  className,
  centerContent,
  rightContent,
  asSlot = false,
}: NavigationProps) {
  const { styleName, setStyleName, palette, setPaletteSelection } = useTheme();
  const [isColorEditorOpen, setIsColorEditorOpen] = useState(false);
  const [editingColors, setEditingColors] = useState<ColorInput>(palette);
  const { presets, savePreset, deletePreset } = usePalettePresets();

  const handleThemeChange = (value: string) => {
    setStyleName(value as StyleName);
  };

  const handleColorChange = (newPalette: ColorInput) => {
    setEditingColors(newPalette);
  };

  const applyColors = () => {
    setPaletteSelection(createCustomSelection(editingColors));
    setIsColorEditorOpen(false);
  };

  const resetColors = () => {
    setEditingColors(palette);
  };

  const handleSavePreset = (name: string) => {
    savePreset(name, editingColors);
  };

  const handleLoadPreset = (preset: { palette: ColorInput }) => {
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
                  onSave={handleSavePreset}
                  onSelect={handleLoadPreset}
                  onDelete={deletePreset}
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
            value={styleName}
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
      <div className={clsx(styles.slot, className)} data-shell>
        {navContent}
      </div>
    );
  }

  return (
    <nav
      className={clsx(styles.nav, sticky && styles.sticky, className)}
      data-shell
    >
      <div className={styles.left}>
        <span
          className={styles.brand}
          onClick={onLogoClick}
          role={onLogoClick ? 'button' : undefined}
          tabIndex={onLogoClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onLogoClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onLogoClick();
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
