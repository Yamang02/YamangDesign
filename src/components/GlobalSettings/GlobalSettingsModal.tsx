/**
 * E03: 전역 설정 모달 - Light Theme, 새 UI 구조
 * P05: 프리셋 섹션에 탭(Custom/Default/Natural) + 검색 UI
 * PaletteSelection 기반 마이그레이션
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { Select } from '../Select';
import { Tooltip } from '../Tooltip';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { useTheme } from '../../themes';
import {
  themeRegistry,
  getThemesByCategory,
  searchThemesByName,
} from '../../palettes/presets/registry';
import type { ThemeCategory } from '../../palettes/types';
import type { ExternalPalette } from '../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../@types/theme';
import { ThemeTabNavigation } from '../../pages/layouts/PaletteLab/ThemeTabNavigation';
import { ThemeSearchBar } from '../../pages/layouts/PaletteLab/ThemeSearchBar';
import { EmptyCategory } from '../../pages/layouts/PaletteLab/EmptyCategory';
import { themePresets } from '../../constants/palette-definitions';
import { presetToPaletteDefinition } from '../../constants/semantic-presets';
import { createCustomSemanticSelection } from '../../utils/palette-selection';
import type { StoredPreset } from './types';
import type { CustomSemanticPreset } from '../../constants/semantic-presets';
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
  { value: 'brutalism', label: 'Brutalism' },
];

const SYSTEM_OPTIONS: { value: SystemPresetName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'muted', label: 'Muted' },
];

function getPresetColorsFromPalette(p: ExternalPalette) {
  return [
    p.primary || '#ccc',
    p.secondary || '#ccc',
    p.accent || '#ccc',
    p.sub || '#ccc',
    p.neutral || '#ccc',
  ];
}

function PresetItemCustom({
  preset,
  onLoad,
  onDelete,
}: {
  preset: StoredPreset;
  onLoad: (p: StoredPreset) => void;
  onDelete: (id: string) => void;
}) {
  const palette = preset.settings.palette || {};
  return (
    <div className={styles.presetItem}>
      <span className={`${styles.presetBadge} ${styles.custom}`}>
        Custom
      </span>
      <button
        type="button"
        className={styles.presetName}
        onClick={() => onLoad(preset)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
      >
        {preset.name}
      </button>
      <div className={styles.presetColors}>
        {getPresetColorsFromPalette(palette).map((color, i) => (
          <span
            key={i}
            className={styles.presetDot}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className={styles.presetDeleteSlot}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset.id);
          }}
          aria-label={`${preset.name} 삭제`}
        >
          <Icon name="delete" size="sm" />
        </button>
      </div>
    </div>
  );
}

function PresetItemSemanticCustom({
  preset,
  onLoad,
  onDelete,
}: {
  preset: CustomSemanticPreset;
  onLoad: (p: CustomSemanticPreset) => void;
  onDelete: (id: string) => void;
}) {
  const def = presetToPaletteDefinition(preset);
  const colors = def
    ? getPresetColorsFromPalette(def.colors as ExternalPalette)
    : ['#ccc', '#ccc', '#ccc', '#ccc', '#ccc'];
  const displayName =
    preset.displayName ??
    `${themePresets[preset.basePaletteId as keyof typeof themePresets]?.metadata?.displayName ?? preset.basePaletteId} (커스텀)`;
  return (
    <div className={styles.presetItem}>
      <span className={`${styles.presetBadge} ${styles.semantic}`}>
        시맨틱
      </span>
      <button
        type="button"
        className={styles.presetName}
        onClick={() => onLoad(preset)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
      >
        {displayName}
      </button>
      <div className={styles.presetColors}>
        {colors.map((color, i) => (
          <span
            key={i}
            className={styles.presetDot}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className={styles.presetDeleteSlot}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset.id);
          }}
          aria-label={`${displayName} 삭제`}
        >
          <Icon name="delete" size="sm" />
        </button>
      </div>
    </div>
  );
}

export function GlobalSettingsModal({ open, onClose }: GlobalSettingsModalProps) {
  const {
    palette,
    styleName,
    systemPreset,
    setPalette,
    setStyleName,
    setSystemPreset,
    setSelection,
    selectPreset,
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

  const {
    customSemanticPresets,
    deleteCustomSemanticPreset,
  } = useTheme();

  // 커스텀 시맨틱 프리셋 로드 (로컬 상태로)
  const handleLoadCustomSemanticPreset = (preset: CustomSemanticPreset) => {
    setSelection(createCustomSemanticSelection(preset.id));
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [presetTab, setPresetTab] = useState<ThemeCategory>('custom');
  const [presetSearch, setPresetSearch] = useState('');

  const themesByCategory = useMemo(
    () =>
      Object.fromEntries(
        themeRegistry.map((g) => [g.category, getThemesByCategory(g.category)])
      ),
    []
  );

  const filteredThemesByCategory = useMemo(() => {
    if (!presetSearch.trim()) return themesByCategory;
    const all = searchThemesByName(presetSearch);
    return Object.fromEntries(
      Object.entries(themesByCategory).map(([cat, themes]) => [
        cat,
        themes.filter((t) =>
          all.some((a) => a.metadata?.id === t.metadata?.id)
        ),
      ])
    );
  }, [themesByCategory, presetSearch]);

  const filteredUserPresets = useMemo(() => {
    if (!presetSearch.trim()) return userPresets;
    const q = presetSearch.toLowerCase();
    return userPresets.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }, [userPresets, presetSearch]);

  const filteredCustomSemanticPresets = useMemo(() => {
    if (!presetSearch.trim()) return customSemanticPresets;
    const q = presetSearch.toLowerCase();
    const baseNames = Object.fromEntries(
      Object.entries(themePresets).map(([id, def]) => [
        id,
        (def.metadata?.displayName ?? id).toLowerCase(),
      ])
    );
    return customSemanticPresets.filter((p) => {
      const name = (p.displayName ?? baseNames[p.basePaletteId] ?? p.basePaletteId).toLowerCase();
      return name.includes(q);
    });
  }, [customSemanticPresets, presetSearch]);

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
        data-shell
      >
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

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>컬러 팔레트</h3>
            <div className={styles.paletteList}>
              {COLOR_FIELDS.map((field) => (
                <div key={field.key} className={`${styles.flatCard} ${styles.paletteRow}`}>
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
                    <div className={styles.paletteDeleteSlot}>
                      {!field.required && palette[field.key] && (
                        <button
                          type="button"
                          className={styles.paletteClearBtn}
                          onClick={() => handleClearColor(field.key)}
                          aria-label={`${field.label} 초기화`}
                        >
                          <Icon name="delete" size="sm" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>프리셋</h3>
              <div className={styles.saveInline}>
                {showSaveInput ? (
                  <>
                    <input
                      type="text"
                      className={styles.saveInlineInput}
                      placeholder="프리셋 이름"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePreset();
                        if (e.key === 'Escape') setShowSaveInput(false);
                      }}
                      autoFocus
                    />
                    <Tooltip content="저장" portal position="top">
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={handleSavePreset}
                        aria-label="저장"
                      >
                        <Icon name="check" size="sm" />
                      </button>
                    </Tooltip>
                    <Tooltip content="취소" portal position="top">
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setShowSaveInput(false)}
                        aria-label="취소"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip content="현재 설정 저장" portal position="top">
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setShowSaveInput(true)}
                      aria-label="현재 설정 저장"
                    >
                      <Icon name="save" size="sm" />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className={styles.presetTabsWrapper}>
              <ThemeTabNavigation
                activeTab={presetTab}
                onTabChange={setPresetTab}
              />
              <ThemeSearchBar
                value={presetSearch}
                onChange={setPresetSearch}
                placeholder="프리셋 검색..."
              />
            </div>
            <>
            <div
              id="panel-custom"
              role="tabpanel"
              aria-labelledby="tab-custom"
              hidden={presetTab !== 'custom'}
              className={styles.presetPanel}
            >
              {presetTab === 'custom' && (
                <>
                  {filteredUserPresets.length === 0 && filteredCustomSemanticPresets.length === 0 ? (
                    <EmptyCategory
                      message={
                        presetSearch
                          ? '검색 결과가 없습니다'
                          : '저장된 Custom 프리셋이 없습니다. 색상 편집 후 저장하거나 Palette Lab에서 시맨틱 매핑을 적용해 보세요.'
                      }
                    />
                  ) : (
                    <div className={styles.presetList}>
                      {filteredCustomSemanticPresets.map((preset) => (
                        <PresetItemSemanticCustom
                          key={`semantic-${preset.id}`}
                          preset={preset}
                          onLoad={handleLoadCustomSemanticPreset}
                          onDelete={deleteCustomSemanticPreset}
                        />
                      ))}
                      {filteredUserPresets.map((preset) => (
                        <PresetItemCustom
                          key={`color-${preset.id}`}
                          preset={preset}
                          onLoad={loadUserPreset}
                          onDelete={deleteUserPreset}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {themeRegistry.map((group) => {
              const filtered = filteredThemesByCategory[group.category] ?? [];
              const badgeClass =
                group.category === 'default'
                  ? styles.yamang
                  : group.category === 'natural'
                    ? styles.natural
                    : styles.category;
              return (
                <div
                  key={group.category}
                  id={`panel-${group.category}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${group.category}`}
                  hidden={presetTab !== group.category}
                  className={styles.presetPanel}
                >
                  {presetTab === group.category && (
                    <>
                      {filtered.length === 0 ? (
                        <EmptyCategory
                          message={
                            presetSearch
                              ? '검색 결과가 없습니다'
                              : `${group.displayName} 테마가 없습니다`
                          }
                        />
                      ) : (
                        <div className={styles.presetList}>
                          {filtered.map((def) => (
                            <button
                              key={def.metadata?.id ?? def.name}
                              type="button"
                              className={styles.presetItem}
                              onClick={() => {
                                // 프리셋 선택 시 새 API 사용
                                if (def.metadata?.id) {
                                  selectPreset(def.metadata.id);
                                } else {
                                  setPalette(def.colors as ExternalPalette);
                                }
                              }}
                            >
                              <span
                                className={styles.presetBadge + ' ' + badgeClass}
                              >
                                {group.displayName}
                              </span>
                              <span className={styles.presetName}>
                                {def.metadata?.displayName ?? def.name}
                              </span>
                              <div className={styles.presetColors}>
                                {getPresetColorsFromPalette(
                                  def.colors as ExternalPalette
                                ).map((color, i) => (
                                  <span
                                    key={i}
                                    className={styles.presetDot}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <div
                                className={styles.presetDeleteSlot}
                                aria-hidden
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            </>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>스타일 / 시스템</h3>
            <div className={styles.settingsList}>
              <div className={styles.settingRow}>
                <span className={styles.settingLabel}>스타일</span>
                <div className={styles.settingSelect}>
                  <Select
                    options={STYLE_OPTIONS}
                    value={styleName}
                    onChange={(v) => setStyleName(v as StyleName)}
                    size="sm"
                  />
                </div>
              </div>
              <div className={styles.settingRow}>
                <span className={styles.settingLabel}>시스템 색상</span>
                <div className={styles.settingSelect}>
                  <Select
                    options={SYSTEM_OPTIONS}
                    value={systemPreset}
                    onChange={(v) => setSystemPreset(v as SystemPresetName)}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <Tooltip content="내보내기" portal position="top">
              <button
                type="button"
                className={styles.footerBtn}
                onClick={exportSettings}
                aria-label="내보내기"
              >
                <Icon name="download" library="nucleo" size="sm" />
              </button>
            </Tooltip>
            <Tooltip content="가져오기" portal position="top">
              <button
                type="button"
                className={styles.footerBtn}
                onClick={() => importSettings()}
                aria-label="가져오기"
              >
                <Icon name="upload" library="nucleo" size="sm" />
              </button>
            </Tooltip>
          </div>
          <div className={styles.footerRight}>
            <Tooltip content="초기화" portal position="top">
              <button
                type="button"
                className={styles.footerBtn}
                onClick={reset}
                aria-label="초기화"
              >
                <Icon name="refresh" library="nucleo" size="sm" />
              </button>
            </Tooltip>
            <Tooltip content="적용" portal position="top">
              <button
                type="button"
                className={`${styles.footerBtn} ${styles.primary}`}
                onClick={handleApply}
                disabled={!hasChanges}
                aria-label="적용"
              >
                <Icon name="check" size="sm" />
              </button>
            </Tooltip>
          </div>
        </footer>
      </div>
    </div>
  );
}
