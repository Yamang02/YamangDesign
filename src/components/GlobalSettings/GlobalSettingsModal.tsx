/**
 * E03: 전역 설정 모달 - Light Theme, 새 UI 구조
 */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Select } from '../Select';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { themePresets } from '../../constants/palette-definitions';
import type { ExternalPalette } from '../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../@types/theme';
import styles from './GlobalSettingsModal.module.css';

export interface GlobalSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const COLOR_FIELDS: {
  key: keyof ExternalPalette;
  label: string;
  required: boolean;
}[] = [
  { key: 'primary', label: 'Primary', required: true },
  { key: 'secondary', label: 'Secondary', required: false },
  { key: 'accent', label: 'Accent', required: false },
  { key: 'sub', label: 'Sub', required: false },
  { key: 'neutral', label: 'Neutral', required: false },
];

const STYLE_OPTIONS: { value: StyleName; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

const SYSTEM_OPTIONS: { value: SystemPresetName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'muted', label: 'Muted' },
];

const YAMANG_PRESETS = Object.entries(themePresets) as [
  string,
  { name: string; colors: ExternalPalette }
][];

export function GlobalSettingsModal({ open, onClose }: GlobalSettingsModalProps) {
  const {
    palette,
    styleName,
    systemPreset,
    setPalette,
    setStyleName,
    setSystemPreset,
    hasChanges,
    apply,
    reset,
    exportSettings,
    importSettings,
    userPresets,
    saveAsPreset,
    loadUserPreset,
    deleteUserPreset,
  } = useGlobalSettings();

  const modalRef = useRef<HTMLDivElement>(null);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleApply = () => {
    apply();
    onClose();
  };

  const handleColorChange = (key: keyof ExternalPalette, value: string) => {
    setPalette({ ...palette, [key]: value || undefined });
  };

  const handleClearColor = (key: keyof ExternalPalette) => {
    const newPalette = { ...palette };
    delete newPalette[key];
    setPalette(newPalette);
  };

  const handleSavePreset = () => {
    if (saveName.trim()) {
      saveAsPreset(saveName.trim());
      setSaveName('');
      setShowSaveInput(false);
    }
  };

  const getPresetColors = (p: ExternalPalette) => [
    p.primary || '#ccc',
    p.secondary || '#ccc',
    p.accent || '#ccc',
    p.sub || '#ccc',
    p.neutral || '#ccc',
  ];

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-settings-title"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        data-ui-light
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 id="global-settings-title" className={styles.title}>
            디자인 시스템 설정
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <Icon name="close" size="sm" />
          </button>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Section 1: Color Palette */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>컬러 팔레트</h3>
            <div className={styles.paletteGrid}>
              {COLOR_FIELDS.map((field) => (
                <div key={field.key} className={styles.paletteRow}>
                  <span className={styles.paletteLabel}>
                    {field.label}
                    {field.required && ' *'}
                  </span>
                  <div className={styles.paletteInputRow}>
                    <div
                      className={styles.colorSwatch}
                      style={{ backgroundColor: palette[field.key] || '#cccccc' }}
                    >
                      <input
                        type="color"
                        value={palette[field.key] || '#cccccc'}
                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      className={styles.hexInput}
                      value={palette[field.key] || ''}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      placeholder={field.required ? '' : 'Auto'}
                    />
                    {!field.required && palette[field.key] && (
                      <button
                        type="button"
                        className={styles.autoBtn}
                        onClick={() => handleClearColor(field.key)}
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Presets */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>프리셋</h3>
            <div className={styles.presetList}>
              {/* Yamang Presets */}
              {YAMANG_PRESETS.map(([id, def]) => (
                <button
                  key={id}
                  type="button"
                  className={styles.presetItem}
                  onClick={() => setPalette(def.colors)}
                >
                  <span className={`${styles.presetBadge} ${styles.yamang}`}>
                    Yamang
                  </span>
                  <span className={styles.presetName}>{def.name}</span>
                  <div className={styles.presetColors}>
                    {getPresetColors(def.colors).map((color, i) => (
                      <span
                        key={i}
                        className={styles.presetDot}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}

              {/* User Presets */}
              {userPresets.map((preset) => (
                <div key={preset.id} className={styles.presetItem}>
                  <span className={`${styles.presetBadge} ${styles.custom}`}>
                    Custom
                  </span>
                  <button
                    type="button"
                    className={styles.presetName}
                    onClick={() => loadUserPreset(preset)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    {preset.name}
                  </button>
                  <div className={styles.presetColors}>
                    {getPresetColors(preset.settings.palette || {}).map((color, i) => (
                      <span
                        key={i}
                        className={styles.presetDot}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => deleteUserPreset(preset.id)}
                    aria-label={`${preset.name} 삭제`}
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </div>
              ))}

              {/* Save Preset */}
              <div className={styles.savePresetRow}>
                {showSaveInput ? (
                  <>
                    <input
                      type="text"
                      className={styles.savePresetInput}
                      placeholder="프리셋 이름"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePreset();
                        if (e.key === 'Escape') setShowSaveInput(false);
                      }}
                      autoFocus
                    />
                    <Button variant="primary" size="sm" onClick={handleSavePreset}>
                      저장
                    </Button>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => setShowSaveInput(false)}
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.addPresetBtn}
                    onClick={() => setShowSaveInput(true)}
                  >
                    <Icon name="add" size="sm" />
                    현재 설정 저장
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Style & System */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>스타일 / 시스템</h3>
            <div className={styles.inlineRow}>
              <span className={styles.inlineLabel}>스타일</span>
              <div className={styles.inlineSelect}>
                <Select
                  options={STYLE_OPTIONS}
                  value={styleName}
                  onChange={(v) => setStyleName(v as StyleName)}
                  size="sm"
                />
              </div>
            </div>
            <div className={styles.inlineRow}>
              <span className={styles.inlineLabel}>시스템 색상</span>
              <div className={styles.inlineSelect}>
                <Select
                  options={SYSTEM_OPTIONS}
                  value={systemPreset}
                  onChange={(v) => setSystemPreset(v as SystemPresetName)}
                  size="sm"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <Button variant="ghost" size="sm" onClick={exportSettings}>
              내보내기
            </Button>
            <Button variant="ghost" size="sm" onClick={() => importSettings()}>
              가져오기
            </Button>
          </div>
          <div className={styles.footerRight}>
            <Button variant="ghost" size="sm" onClick={reset}>
              초기화
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              disabled={!hasChanges}
            >
              적용
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
